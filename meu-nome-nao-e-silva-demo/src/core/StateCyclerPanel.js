import { assetManifest } from "../data/assets.js";
import { actionMap } from "../data/actionMap.js";
import { makerCombatStates } from "../data/makerDefaults.js";

const ENTITY_RECORDS = [
  ...Object.values(assetManifest.characters).map((record) => ({ ...record, group: "Protagonista" })),
  ...Object.values(assetManifest.enemies).map((record) => ({ ...record, group: "Inimigos" }))
];

const ACTION_MAP_BY_ID = new Map(actionMap.map((action) => [action.id, action]));
const MAKER_STATE_BY_ID = new Map(makerCombatStates.map((state) => [state.id, state]));
const ACTION_OWNER_INDEX = ENTITY_RECORDS.reduce((index, record) => {
  for (const id of Object.keys(record.sheet?.animations || {})) {
    if (!index.has(id)) index.set(id, []);
    index.get(id).push(record);
  }
  return index;
}, new Map());

const PLAYER_EXPECTED = [
  "idle",
  "walk",
  "run",
  "light",
  "heavy",
  "dashMove",
  "dashAttack",
  "launcher",
  "grab",
  "dodge",
  "jump",
  "air",
  "airNeutral",
  "airForward",
  "airDown",
  "landing",
  "special",
  "specialOffensive",
  "specialDefensive",
  "redSash",
  "hit",
  "defeated"
];

const ENEMY_EXPECTED = ["enter", "idle", "chase", "attack", "rope", "hit", "launched", "stunned", "defeated"];

const ACTION_LABELS = {
  idle: "Idle",
  walk: "Walk / Move",
  run: "Run",
  light: "Ataque basico",
  comboStart: "Combo start",
  comboContinue: "Combo continue",
  comboEnd: "Combo end / knockdown",
  heavy: "Heavy / Finisher",
  dashMove: "Dash / Blitz movimento",
  dashAttack: "Blitz Attack",
  launcher: "Launcher",
  grab: "Grab",
  dodge: "Dodge / Evade",
  jump: "Jump",
  air: "Air slash placeholder",
  airNeutral: "Neutral Air Attack",
  airForward: "Forward Air Attack",
  airDown: "Down Air Attack",
  landing: "Landing",
  pulse: "Spirit Pulse",
  special: "Special placeholder",
  specialOffensive: "Offensive Special",
  specialDefensive: "Defensive Special",
  redSash: "Especial da faixa vermelha",
  grabReach: "Grab reach",
  grabHold: "Grab hold",
  grabThrow: "Grab throw",
  groundRecover: "Ground recovery",
  ritualItem: "Ritual item hold",
  idleAlt: "Idle alternativo",
  intimidate: "Intimidar / Sentenca",
  sashCall: "Chamada da faixa",
  sentencePoint: "Apontar / nomear",
  spiritRise: "Estado espiritual",
  kneelRecover: "Ajoelhar / recuperar",
  stagger: "Stagger",
  knockdown: "Knockdown",
  wakeup: "Wake-up",
  guardSpecial: "Guarda especial",
  mercyGrab: "Contencao",
  sentenceFinish: "Finalizacao / Sentenca",
  carryGrab: "Carregar / dominar",
  afterSentence: "Pos-sentenca",
  foodRecover: "Recuperar alimento",
  idleReturn: "Retorno ao idle",
  enter: "Entrada",
  chase: "Perseguicao",
  attack: "Ataque inimigo",
  rope: "Laco / captura",
  hit: "Hitstun",
  launched: "Launch reaction",
  stunned: "Stunned / Fear",
  defeated: "KO / derrotado"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export class StateCyclerPanel {
  constructor({ root, assets, audio, onBack }) {
    this.root = root;
    this.assets = assets;
    this.audio = audio;
    this.onBack = onBack;
    this.selectedAssetId = "silvaActions";
    this.selectedAnimation = "dashAttack";
    this.selectedActionId = "dashAttack";
    this.assetAssignments = new Map();
    this.objectUrls = [];
    this.frameIndex = 0;
    this.actionIndex = 0;
    this.playing = true;
    this.autoCycle = false;
    this.actionFilter = "";
    this.showOnlyMissingActions = false;
    this.previewAdjustments = new Map();
    this.lastTime = 0;
    this.frameAccumulator = 0;
    this.cycleAccumulator = 0;
    this.cycleMs = 3600;
    this.raf = 0;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.animate = this.animate.bind(this);
  }

  start() {
    this.syncSelectedAnimation();
    this.render();
    this.bind();
    this.raf = requestAnimationFrame(this.animate);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.handleKeyDown);
    for (const url of this.objectUrls) URL.revokeObjectURL(url);
  }

  selectedRecord() {
    return ENTITY_RECORDS.find((record) => record.id === this.selectedAssetId) || ENTITY_RECORDS[0];
  }

  selectedSheet() {
    return this.selectedRecord()?.sheet || null;
  }

  animationEntries() {
    return Object.entries(this.selectedSheet()?.animations || {});
  }

  selectedAnimationData() {
    return this.selectedSheet()?.animations?.[this.selectedAnimation] || null;
  }

  syncSelectedAnimation() {
    const entries = this.animationEntries();
    if (!entries.length) {
      this.selectedAnimation = "";
      this.actionIndex = 0;
      return;
    }
    const index = entries.findIndex(([id]) => id === this.selectedAnimation);
    this.actionIndex = index >= 0 ? index : 0;
    this.selectedAnimation = entries[this.actionIndex][0];
    this.selectedActionId = this.selectedAnimation;
  }

  actionCatalog() {
    const ids = new Set(actionMap.map((action) => action.id));
    for (const record of ENTITY_RECORDS) {
      Object.keys(record.sheet?.animations || {}).forEach((id) => ids.add(id));
      (record.qaExpected || []).forEach((id) => ids.add(id));
    }
    return Array.from(ids).map((id) => this.actionDefinition(id));
  }

  visibleActionCatalog() {
    const filter = this.actionFilter.trim().toLowerCase();
    return this.actionCatalog().filter((action) => {
      const owners = this.actionOwners(action.id);
      const searchable = `${action.id} ${action.label} ${action.group} ${action.command}`.toLowerCase();
      if (this.showOnlyMissingActions && owners.length) return false;
      return !filter || searchable.includes(filter);
    });
  }

  actionDefinition(id) {
    const mapped = ACTION_MAP_BY_ID.get(id);
    if (mapped) return mapped;
    const makerState = MAKER_STATE_BY_ID.get(id);
    return {
      id,
      label: this.actionLabel(id),
      domain: id === "enter" || id === "chase" || id === "rope" || id === "stunned" ? "enemy" : "player",
      group: makerState?.systemic ? "Planejado" : "Manifesto",
      command: makerState?.command || "Configurado no manifesto",
      from: ["any"],
      to: ["idle"],
      assetSlots: ["sprite", "sfx"],
      promptDefault: makerState?.promptHint || "Use o padrao tecnico de sprites com alpha, margem e ancora estavel."
    };
  }

  actionOwners(actionId) {
    return ACTION_OWNER_INDEX.get(actionId) || [];
  }

  isSelectableAction(actionId) {
    if (!actionId || ["any", "offscreen", "respawn", "gameover", "fear", "turn"].includes(actionId)) return false;
    return ACTION_MAP_BY_ID.has(actionId) || this.actionOwners(actionId).length || MAKER_STATE_BY_ID.has(actionId);
  }

  selectedAssignment() {
    if (!this.assetAssignments.has(this.selectedActionId)) {
      this.assetAssignments.set(this.selectedActionId, {
        visualUrl: "",
        visualName: "",
        visualType: "",
        visualPath: "",
        audioUrl: "",
        audioName: "",
        audioPath: "",
        notes: ""
      });
    }
    return this.assetAssignments.get(this.selectedActionId);
  }

  selectedPreviewAdjustment() {
    if (!this.previewAdjustments.has(this.selectedActionId)) {
      this.previewAdjustments.set(this.selectedActionId, {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        footY: 820,
        showFrame: true
      });
    }
    return this.previewAdjustments.get(this.selectedActionId);
  }

  render() {
    const record = this.selectedRecord();
    const entries = this.animationEntries();
    const diagnostics = this.assetDiagnostics(record);
    const action = this.actionDefinition(this.selectedActionId || this.selectedAnimation);
    const assignment = this.selectedAssignment();
    const adjustment = this.selectedPreviewAdjustment();
    const visibleActions = this.visibleActionCatalog();
    this.root.innerHTML = `
      <section class="screen cycler-screen">
        <article class="cycler-shell">
          <header class="cycler-header">
            <div>
              <p class="eyebrow">Sprite QA / state cycler</p>
              <h2>Ciclo de estados</h2>
              <p class="lead compact">Ferramenta para ver rapidamente quais acoes possuem sprite, quais parecem placeholders e quais estao repetidas no sheet.</p>
            </div>
            <div class="cycler-actions">
              <button data-cycler-action="prev-action">Acao anterior</button>
              <button data-cycler-action="play">${this.playing ? "Pausar" : "Tocar"}</button>
              <button data-cycler-action="next-action">Proxima acao</button>
              <button data-cycler-action="export-map">Exportar mapa</button>
              <button data-action="back">Voltar</button>
            </div>
          </header>
          ${this.renderStatusStrip(record, diagnostics, action, visibleActions)}
          <section class="cycler-layout">
            <aside class="cycler-sidebar">
              <section class="cycler-panel">
                <h3>Personagens / classes</h3>
                ${this.renderRecordSelect(record)}
                <div class="cycler-list">
                  ${ENTITY_RECORDS.map((item) => this.renderRecordButton(item)).join("")}
                </div>
              </section>
              <section class="cycler-panel">
                <h3>Mapa de acoes</h3>
                ${this.renderActionFilter()}
                <div class="cycler-action-map">
                  ${visibleActions.length ? visibleActions.map((item) => this.renderActionNode(item)).join("") : "<p class='maker-comment'>Nenhuma acao encontrada neste filtro.</p>"}
                </div>
              </section>
              <section class="cycler-panel">
                <h3>Estados deste asset</h3>
                ${this.renderAnimationSelect(entries)}
                <div class="cycler-list compact">
                  ${
                    entries.length
                      ? entries.map(([id, animation]) => this.renderAnimationButton(record, id, animation)).join("")
                      : "<p class='maker-comment'>Asset sem spritesheet configurado.</p>"
                  }
                </div>
              </section>
            </aside>
            <section class="cycler-stage-card">
              <div class="cycler-stage-toolbar">
                <span>${escapeHtml(record.label)}</span>
                <span data-cycler-frame>frame 0</span>
              </div>
              <div class="cycler-stage">
                <canvas class="cycler-canvas" width="1920" height="1080" data-cycler-canvas></canvas>
                ${this.renderUploadedVisual(assignment)}
                <div class="cycler-action-readout">
                  <p class="eyebrow">Estado atual</p>
                  <h3 data-cycler-action-name>${escapeHtml(action.label || this.actionLabel(this.selectedActionId))}</h3>
                  <p data-cycler-action-meta>${this.animationMetaText()}</p>
                </div>
              </div>
            </section>
            <aside class="cycler-inspector">
              <section class="cycler-panel">
                <h3>Relacao da acao</h3>
                ${this.renderActionRelation(action)}
              </section>
              <section class="cycler-panel">
                <h3>Slots de assets</h3>
                ${this.renderAssetSlots(action, assignment)}
              </section>
              <section class="cycler-panel">
                <h3>Ajuste fino do sprite</h3>
                ${this.renderSpriteAdjustment(adjustment)}
              </section>
              <section class="cycler-panel">
                <h3>Diagnostico</h3>
                <div class="cycler-flags">${diagnostics.flags.map((flag) => this.renderFlag(flag)).join("")}</div>
              </section>
              <section class="cycler-panel">
                <h3>Ausentes planejados</h3>
                <p class="maker-comment">${diagnostics.missing.length ? diagnostics.missing.join(", ") : "Nenhum estado basico ausente neste perfil."}</p>
              </section>
              <section class="cycler-panel">
                <h3>Prompt tecnico default</h3>
                <textarea class="maker-prompt cycler-prompt" readonly>${this.promptForState(record, this.selectedAnimation)}</textarea>
              </section>
            </aside>
          </section>
        </article>
      </section>
    `;
    this.draw();
  }

  renderActionNode(action) {
    const active = action.id === this.selectedActionId ? "is-active" : "";
    const owners = this.actionOwners(action.id);
    const slot = this.assetAssignments.get(action.id);
    const status = this.actionStatus(action, owners, slot);
    const media = slot?.visualName || slot?.audioName ? " | upload" : "";
    return `
      <button class="cycler-action-node ${active} ${status.className}" data-cycler-action-node="${action.id}">
        <strong>${escapeHtml(action.label || action.id)}</strong>
        <span>${escapeHtml(action.group || "Sistema")} | ${status.label}${media}</span>
      </button>
    `;
  }

  actionStatus(action, owners = this.actionOwners(action.id), slot = this.assetAssignments.get(action.id)) {
    if (slot?.visualName || slot?.audioName) return { label: "override local", className: "has-upload" };
    if (owners.length) return { label: `${owners.length} sprite`, className: "has-asset" };
    return { label: "sprite faltante", className: "missing-asset" };
  }

  renderActionFilter() {
    return `
      <div class="cycler-action-tools">
        <input data-cycler-filter value="${escapeHtml(this.actionFilter)}" placeholder="Filtrar por golpe, grupo ou comando" />
        <button class="${this.showOnlyMissingActions ? "is-active" : ""}" data-cycler-action="toggle-missing">
          ${this.showOnlyMissingActions ? "Mostrar todos" : "So faltantes"}
        </button>
      </div>
    `;
  }

  renderRecordSelect(record) {
    return `
      <label class="cycler-select-field">
        <span>Asset ativo</span>
        <select data-cycler-asset-select>
          ${ENTITY_RECORDS.map((item) => `<option value="${item.id}" ${item.id === record.id ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  renderAnimationSelect(entries) {
    if (!entries.length) return "";
    return `
      <label class="cycler-select-field">
        <span>Estado / animacao</span>
        <select data-cycler-animation-select>
          ${entries.map(([id, animation]) => `<option value="${id}" ${id === this.selectedAnimation ? "selected" : ""}>${escapeHtml(this.actionLabel(id))} | ${id} | ${animation.frames.length}f</option>`).join("")}
        </select>
      </label>
    `;
  }

  renderStatusStrip(record, diagnostics, action, visibleActions) {
    const totalActions = this.actionCatalog().length;
    const missingActions = this.actionCatalog().filter((item) => !this.actionOwners(item.id).length).length;
    const issueCount = diagnostics.flags.filter((flag) => flag.type !== "ok").length;
    return `
      <div class="cycler-status-strip">
        <span><small>Asset</small><strong>${escapeHtml(record.label)}</strong></span>
        <span><small>Acao</small><strong>${escapeHtml(action.label || action.id)}</strong></span>
        <span><small>Mapa</small><strong>${visibleActions.length}/${totalActions}</strong></span>
        <span><small>Sprites faltando</small><strong>${missingActions}</strong></span>
        <span><small>Revisoes deste asset</small><strong>${issueCount}</strong></span>
      </div>
    `;
  }

  renderRecordButton(record) {
    const active = record.id === this.selectedAssetId ? "is-active" : "";
    const count = Object.keys(record.sheet?.animations || {}).length;
    const sheetText = record.sheet ? `${count} estados | ${record.sheet.frameWidth}x${record.sheet.frameHeight}` : "sem sheet";
    return `
      <button class="cycler-list-item ${active}" data-cycler-asset="${record.id}">
        <strong>${escapeHtml(record.label)}</strong>
        <span>${record.group} | ${sheetText}</span>
      </button>
    `;
  }

  renderAnimationButton(record, id, animation) {
    const diagnostics = this.animationDiagnostics(record, id, animation);
    const active = id === this.selectedAnimation ? "is-active" : "";
    return `
      <button class="cycler-list-item ${active}" data-cycler-animation="${id}">
        <strong>${escapeHtml(this.actionLabel(id))}</strong>
        <span>${id} | row ${animation.row} | ${animation.frames.length} frames ${diagnostics.length ? "| revisar" : ""}</span>
      </button>
    `;
  }

  renderFlag(flag) {
    return `<span class="cycler-flag ${flag.type}"><strong>${escapeHtml(flag.title)}</strong>${escapeHtml(flag.body)}</span>`;
  }

  renderActionRelation(action) {
    const owners = this.actionOwners(action.id);
    return `
      <div class="cycler-relation-card">
        <strong>${escapeHtml(action.label || action.id)}</strong>
        <span>${escapeHtml(action.command || "sem comando")}</span>
      </div>
      ${this.renderStateFlow(action)}
      ${this.renderTechnicalFlowList(action)}
      <p class="maker-comment">Implementado em: ${owners.length ? owners.map((owner) => owner.id).join(", ") : "nenhum spritesheet ainda"}</p>
    `;
  }

  renderTechnicalFlowList(action) {
    return `
      <details class="cycler-flow-details">
        <summary>Lista tecnica de transicoes</summary>
        <div class="cycler-flow">
          <div><small>Vem de</small>${(action.from || []).map((id) => this.renderTinyJump(id)).join("")}</div>
          <div><small>Vai para</small>${(action.to || []).map((id) => this.renderTinyJump(id)).join("")}</div>
        </div>
      </details>
    `;
  }

  renderTinyJump(id) {
    if (!this.isSelectableAction(id)) return `<span class="cycler-token">${escapeHtml(this.actionLabel(id))}</span>`;
    return `<button data-cycler-jump-action="${id}">${escapeHtml(this.actionLabel(id))}</button>`;
  }

  renderStateFlow(action) {
    const previous = action.from?.length ? action.from : ["idle"];
    const next = action.to?.length ? action.to : ["idle"];
    const breaks = this.breakRoutesFor(action);
    return `
      <div class="cycler-state-flow">
        <div class="state-flow-row">
          <div class="state-flow-group">
            <small>Entrada</small>
            ${previous.map((id) => this.renderFlowNode(id, "previous")).join("")}
          </div>
          <span class="state-flow-arrow">-></span>
          <div class="state-flow-group current-group">
            <small>Agora</small>
            ${this.renderFlowNode(action.id, "current", action.label)}
          </div>
          <span class="state-flow-arrow">-></span>
          <div class="state-flow-group">
            <small>Saidas</small>
            ${next.map((id) => this.renderFlowNode(id, "next")).join("")}
          </div>
        </div>
        <div class="state-flow-break">
          <small>Break / interrupcoes</small>
          ${breaks.map((id) => this.renderFlowNode(id, "break")).join("")}
        </div>
      </div>
    `;
  }

  renderFlowNode(id, role, label = "") {
    const owners = this.actionOwners(id);
    const hasAsset = owners.length > 0;
    const current = id === this.selectedActionId ? "is-current" : "";
    const implemented = hasAsset ? "has-asset" : "missing-asset";
    const selectable = this.isSelectableAction(id);
    const token = selectable ? `data-cycler-jump-action="${id}"` : "disabled";
    const meta = selectable ? "" : "is-meta";
    return `
      <button class="state-flow-node ${role} ${implemented} ${current} ${meta}" ${token}>
        <strong>${escapeHtml(label || this.actionLabel(id))}</strong>
        <span>${selectable ? (hasAsset ? owners.map((owner) => owner.id).join(", ") : "sprite faltante") : "condicao tecnica"}</span>
      </button>
    `;
  }

  breakRoutesFor(action) {
    const baseBreaks = action.domain === "enemy" ? ["hit", "launched", "stunned", "defeated"] : ["hit", "stagger", "knockdown"];
    const defensiveEscape = action.domain === "player" && !["hit", "knockdown", "defeated"].includes(action.id) ? ["specialDefensive"] : [];
    if (action.group === "Grab") return [...baseBreaks, "grabThrow"];
    if (action.group === "Aereo") return [...baseBreaks, "landing"];
    if (action.group === "Narrativa") return [...baseBreaks, "idle"];
    return [...baseBreaks, ...defensiveEscape];
  }

  renderAssetSlots(action, assignment) {
    return `
      <label class="maker-field">
        <span>Visual da acao (.png / .mp4)</span>
        <input type="file" accept="image/png,image/*,video/mp4,video/*" data-cycler-upload="visual" />
        <small>${assignment.visualName ? `Atual: ${escapeHtml(assignment.visualName)}${assignment.visualPath ? ` | salvo em ${escapeHtml(assignment.visualPath)}` : ""}` : "Sem override. Usa o spritesheet se existir."}</small>
      </label>
      <label class="maker-field">
        <span>Som da acao (.mp3)</span>
        <input type="file" accept="audio/mpeg,audio/mp3,audio/*" data-cycler-upload="audio" />
        <small>${assignment.audioName ? `Atual: ${escapeHtml(assignment.audioName)}${assignment.audioPath ? ` | salvo em ${escapeHtml(assignment.audioPath)}` : ""}` : "Sem SFX dedicado neste slot."}</small>
      </label>
      <label class="maker-field">
        <span>Notas tecnicas do slot</span>
        <input value="${escapeHtml(assignment.notes)}" data-cycler-note="notes" placeholder="ex: precisa recortar halo, aumentar margem, refazer row 2" />
      </label>
      <div class="maker-row">
        <button data-cycler-action="play-sfx" ${assignment.audioUrl ? "" : "disabled"}>Tocar som</button>
        <button data-cycler-action="clear-slot">Limpar slot</button>
      </div>
      <p class="maker-comment">Slots esperados: ${(action.assetSlots || ["sprite", "sfx"]).join(", ")}</p>
    `;
  }

  renderSpriteAdjustment(adjustment) {
    return `
      <div class="cycler-adjust-grid">
        ${this.renderRangeControl("scale", "Escala", adjustment.scale, 0.35, 1.8, 0.01)}
        ${this.renderRangeControl("offsetX", "Offset X", adjustment.offsetX, -380, 380, 1)}
        ${this.renderRangeControl("offsetY", "Offset Y", adjustment.offsetY, -300, 300, 1)}
        ${this.renderRangeControl("footY", "Baseline Y", adjustment.footY, 620, 960, 1)}
      </div>
      <label class="maker-check">
        <input type="checkbox" data-cycler-adjust="showFrame" ${adjustment.showFrame ? "checked" : ""} />
        Mostrar caixa do frame
      </label>
      <div class="maker-row">
        <button data-cycler-action="reset-adjustment">Resetar ajuste</button>
      </div>
      <p class="maker-comment">Ajuste visual local para comparar corte, escala e baseline. Ainda nao altera o spritesheet.</p>
    `;
  }

  renderRangeControl(key, label, value, min, max, step) {
    return `
      <label class="maker-field compact-field">
        <span>${label}: <strong data-cycler-adjust-value="${key}">${Number(value).toFixed(step < 1 ? 2 : 0)}</strong></span>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-cycler-adjust="${key}" />
      </label>
    `;
  }

  renderUploadedVisual(assignment) {
    if (!assignment.visualUrl || assignment.visualType !== "video") return "";
    return `<video class="cycler-media-overlay" src="${assignment.visualUrl}" autoplay muted loop playsinline></video>`;
  }

  bind() {
    this.root.querySelector("[data-action='back']")?.addEventListener("click", () => this.onBack?.());
    this.root.querySelector("[data-cycler-action='play']")?.addEventListener("click", () => {
      this.playing = !this.playing;
      this.render();
      this.bind();
    });
    this.root.querySelector("[data-cycler-action='export-map']")?.addEventListener("click", () => this.exportActionMap());
    this.root.querySelector("[data-cycler-action='toggle-missing']")?.addEventListener("click", () => {
      this.showOnlyMissingActions = !this.showOnlyMissingActions;
      this.render();
      this.bind();
    });
    this.root.querySelector("[data-cycler-action='clear-slot']")?.addEventListener("click", () => {
      this.assetAssignments.set(this.selectedActionId, { visualUrl: "", visualName: "", visualType: "", visualPath: "", audioUrl: "", audioName: "", audioPath: "", notes: "" });
      this.render();
      this.bind();
    });
    this.root.querySelector("[data-cycler-action='reset-adjustment']")?.addEventListener("click", () => {
      this.previewAdjustments.delete(this.selectedActionId);
      this.render();
      this.bind();
    });
    this.root.querySelector("[data-cycler-action='play-sfx']")?.addEventListener("click", () => this.playAssignedSound());
    this.root.querySelector("[data-cycler-action='prev-action']")?.addEventListener("click", () => this.stepAction(-1));
    this.root.querySelector("[data-cycler-action='next-action']")?.addEventListener("click", () => this.stepAction(1));
    this.root.querySelectorAll("[data-cycler-action-node]").forEach((button) => {
      button.addEventListener("click", () => this.selectAction(button.dataset.cyclerActionNode));
    });
    this.root.querySelectorAll("[data-cycler-jump-action]").forEach((button) => {
      button.addEventListener("click", () => this.selectAction(button.dataset.cyclerJumpAction));
    });
    this.root.querySelectorAll("[data-cycler-asset]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectAsset(button.dataset.cyclerAsset);
      });
    });
    this.root.querySelector("[data-cycler-asset-select]")?.addEventListener("change", (event) => this.selectAsset(event.target.value));
    this.root.querySelectorAll("[data-cycler-animation]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectAnimation(button.dataset.cyclerAnimation);
      });
    });
    this.root.querySelector("[data-cycler-animation-select]")?.addEventListener("change", (event) => this.selectAnimation(event.target.value));
    this.root.querySelectorAll("[data-cycler-upload]").forEach((input) => {
      input.addEventListener("change", () => this.handleUpload(input));
    });
    this.root.querySelector("[data-cycler-filter]")?.addEventListener("input", (event) => {
      this.actionFilter = event.target.value;
      this.render();
      this.bind();
      this.root.querySelector("[data-cycler-filter]")?.focus();
    });
    this.root.querySelector("[data-cycler-note='notes']")?.addEventListener("input", (event) => {
      this.selectedAssignment().notes = event.target.value;
    });
    this.root.querySelectorAll("[data-cycler-adjust]").forEach((input) => {
      input.addEventListener("input", (event) => this.updatePreviewAdjustment(event.target));
      input.addEventListener("change", (event) => this.updatePreviewAdjustment(event.target));
    });
  }

  selectAsset(assetId) {
    this.selectedAssetId = assetId;
    this.frameIndex = 0;
    this.selectedAnimation = "";
    this.syncSelectedAnimation();
    this.selectedActionId = this.selectedAnimation;
    this.audio?.play("menuSelect", 0.65);
    this.render();
    this.bind();
  }

  selectAnimation(animationId) {
    this.selectedAnimation = animationId;
    this.selectedActionId = this.selectedAnimation;
    this.frameIndex = 0;
    this.frameAccumulator = 0;
    this.cycleAccumulator = 0;
    this.syncSelectedAnimation();
    this.audio?.play("menuMove", 0.55);
    this.render();
    this.bind();
  }

  updatePreviewAdjustment(input) {
    const key = input.dataset.cyclerAdjust;
    const adjustment = this.selectedPreviewAdjustment();
    if (input.type === "checkbox") adjustment[key] = input.checked;
    else adjustment[key] = Number(input.value);
    const value = this.root.querySelector(`[data-cycler-adjust-value="${key}"]`);
    if (value && typeof adjustment[key] === "number") value.textContent = adjustment[key].toFixed(input.step && Number(input.step) < 1 ? 2 : 0);
    this.draw();
  }

  handleKeyDown(event) {
    if (event.key === "ArrowRight") this.stepAction(1);
    if (event.key === "ArrowLeft") this.stepAction(-1);
    if (event.key === " ") {
      event.preventDefault();
      this.playing = !this.playing;
      this.render();
      this.bind();
    }
    if (event.key === "Escape") this.onBack?.();
  }

  stepAction(direction) {
    const entries = this.animationEntries();
    if (!entries.length) return;
    this.actionIndex = (this.actionIndex + direction + entries.length) % entries.length;
    this.selectedAnimation = entries[this.actionIndex][0];
    this.selectedActionId = this.selectedAnimation;
    this.frameIndex = 0;
    this.frameAccumulator = 0;
    this.cycleAccumulator = 0;
    this.audio?.play("menuMove", 0.45);
    this.render();
    this.bind();
  }

  selectAction(actionId) {
    if (!this.isSelectableAction(actionId)) return;
    const action = this.actionDefinition(actionId);
    this.selectedActionId = action.id;
    const owner = this.actionOwners(action.id)[0];
    if (owner) {
      this.selectedAssetId = owner.id;
      this.selectedAnimation = action.id;
      this.syncSelectedAnimation();
    } else {
      this.selectedAnimation = action.id;
      this.actionIndex = 0;
    }
    this.frameIndex = 0;
    this.frameAccumulator = 0;
    this.cycleAccumulator = 0;
    this.audio?.play("menuMove", 0.45);
    this.render();
    this.bind();
  }

  async handleUpload(input) {
    const file = input.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url);
    const slot = this.selectedAssignment();
    if (input.dataset.cyclerUpload === "visual") {
      slot.visualUrl = url;
      slot.visualName = file.name;
      slot.visualType = file.type.startsWith("video/") ? "video" : "image";
      slot.visualPath = "";
    } else {
      slot.audioUrl = url;
      slot.audioName = file.name;
      slot.audioPath = "";
    }
    await this.saveUploadedFile(file, input.dataset.cyclerUpload, slot);
    this.render();
    this.bind();
  }

  async saveUploadedFile(file, slotName, slot) {
    try {
      const params = new URLSearchParams({
        action: this.selectedActionId || "unmapped",
        slot: slotName,
        name: file.name
      });
      const response = await fetch(`/api/action-asset?${params}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "upload failed");
      if (slotName === "visual") slot.visualPath = result.path;
      else slot.audioPath = result.path;
    } catch (error) {
      slot.notes = `${slot.notes ? `${slot.notes} | ` : ""}Upload local nao salvo: ${error.message}`;
    }
  }

  playAssignedSound() {
    const slot = this.selectedAssignment();
    if (!slot.audioUrl) return;
    const audio = new Audio(slot.audioUrl);
    audio.volume = 0.85;
    audio.play().catch(() => {});
  }

  exportActionMap() {
    const assignments = Object.fromEntries(
      Array.from(this.assetAssignments.entries()).map(([id, slot]) => [
        id,
        {
          visualName: slot.visualName,
          visualType: slot.visualType,
          visualPath: slot.visualPath,
          audioName: slot.audioName,
          audioPath: slot.audioPath,
          notes: slot.notes
        }
      ])
    );
    const payload = {
      note: "Runtime export from MNES action asset editor. Blob URLs are intentionally omitted; copy approved files into assets/ and update src/data/assets.js or actionMap.js.",
      selectedActionId: this.selectedActionId,
      actions: this.actionCatalog().map((action) => ({
        ...action,
        implementedIn: this.actionOwners(action.id).map((owner) => owner.id)
      })),
      assignments,
      previewAdjustments: Object.fromEntries(this.previewAdjustments.entries())
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    this.objectUrls.push(url);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mnes-action-asset-map.json";
    link.click();
  }

  animate(time) {
    const animation = this.selectedAnimationData();
    const dt = time - (this.lastTime || time);
    if (this.playing && animation?.frames?.length) {
      this.frameAccumulator += dt;
      this.cycleAccumulator += dt;
      const stepMs = 1000 / Math.max(1, animation.fps || 8);
      if (this.frameAccumulator >= stepMs) {
        this.nextFrame(animation);
        this.frameAccumulator = 0;
      }
    }
    this.lastTime = time;
    this.draw();
    this.updateReadout();
    this.raf = requestAnimationFrame(this.animate);
  }

  nextFrame(animation) {
    if (animation.loop === false) {
      this.frameIndex = Math.min(this.frameIndex + 1, animation.frames.length - 1);
      return;
    }
    this.frameIndex = (this.frameIndex + 1) % animation.frames.length;
  }

  updateReadout() {
    const frame = this.root.querySelector("[data-cycler-frame]");
    if (frame) frame.textContent = this.animationMetaText(true);
  }

  draw() {
    const canvas = this.root.querySelector("[data-cycler-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBackground(ctx, canvas);
    this.drawSprite(ctx, canvas);
  }

  drawBackground(ctx, canvas) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#050606");
    gradient.addColorStop(0.55, "#10110d");
    gradient.addColorStop(1, "#21160e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, canvas.height * 0.62, canvas.width, canvas.height * 0.38);

    ctx.save();
    ctx.strokeStyle = "rgba(229,220,196,.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 90, canvas.width - 320, canvas.height - 180);
    ctx.strokeStyle = "rgba(217,147,69,.48)";
    ctx.beginPath();
    ctx.moveTo(0, 820);
    ctx.lineTo(canvas.width, 820);
    ctx.stroke();
    ctx.restore();
  }

  drawSprite(ctx) {
    const record = this.selectedRecord();
    const image = this.assets.image(record.id);
    const sheet = this.selectedSheet();
    const animation = this.selectedAnimationData();
    const assignment = this.selectedAssignment();
    const adjustment = this.selectedPreviewAdjustment();
    if (assignment.visualUrl && assignment.visualType === "image") {
      this.drawUploadedImage(ctx, assignment.visualUrl);
      return;
    }
    if (!image || !sheet || !animation?.frames?.length) {
      this.drawMissing(ctx);
      return;
    }

    const frameSlot = animation.frames[Math.min(this.frameIndex, animation.frames.length - 1)] || 0;
    const inset = sheet.sourceInset || 0;
    const sx = frameSlot * sheet.frameWidth + inset;
    const sy = animation.row * sheet.frameHeight + inset;
    const sw = sheet.frameWidth - inset * 2;
    const sh = sheet.frameHeight - inset * 2;
    const nominalW = sheet.nominalFrameWidth || sheet.frameWidth;
    const nominalH = sheet.nominalFrameHeight || sheet.frameHeight;
    const scale = 2.2 * (260 / nominalH) * adjustment.scale;
    const dw = sw * scale;
    const dh = sh * scale;
    const padX = Math.max(0, (sheet.frameWidth - nominalW) / 2 - inset);
    const padY = Math.max(0, (sheet.frameHeight - nominalH) / 2 - inset);
    const footX = 830 + adjustment.offsetX;
    const footY = adjustment.footY + adjustment.offsetY;
    const dx = footX - nominalW * scale * 0.5 - padX * scale;
    const dy = footY - nominalH * scale - padY * scale;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.38)";
    ctx.beginPath();
    ctx.ellipse(footX, footY + 16, 220, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    if (adjustment.showFrame) {
      ctx.strokeStyle = "rgba(217,147,69,.34)";
      ctx.lineWidth = 3;
      ctx.strokeRect(dx, dy, dw, dh);
    }
    ctx.restore();
  }

  drawUploadedImage(ctx, url) {
    const adjustment = this.selectedPreviewAdjustment();
    if (!this.uploadedImageCache) this.uploadedImageCache = new Map();
    let image = this.uploadedImageCache.get(url);
    if (!image) {
      image = new Image();
      image.onload = () => this.draw();
      image.src = url;
      this.uploadedImageCache.set(url, image);
    }
    if (!image.complete) return;
    const maxW = 760;
    const maxH = 760;
    const scale = Math.min(maxW / image.width, maxH / image.height) * adjustment.scale;
    const dw = image.width * scale;
    const dh = image.height * scale;
    const footX = 830 + adjustment.offsetX;
    const footY = adjustment.footY + adjustment.offsetY;
    const dx = footX - dw * 0.5;
    const dy = footY - dh;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.38)";
    ctx.beginPath();
    ctx.ellipse(footX, footY + 16, 220, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(image, dx, dy, dw, dh);
    if (adjustment.showFrame) {
      ctx.strokeStyle = "rgba(217,147,69,.34)";
      ctx.lineWidth = 3;
      ctx.strokeRect(dx, dy, dw, dh);
    }
    ctx.restore();
  }

  drawMissing(ctx) {
    const record = this.selectedRecord();
    const sheet = this.selectedSheet();
    const title = sheet ? "Sprite ainda nao mapeado para esta acao." : "Sem spritesheet configurado para este asset.";
    const body = sheet
      ? "Use o slot de asset ou registre esta acao no manifesto."
      : "Adicione sheet.animations no manifesto para entrar no ciclo.";
    ctx.save();
    ctx.fillStyle = "rgba(229,220,196,.78)";
    ctx.font = "44px Georgia, serif";
    ctx.fillText(title, 520, 510);
    ctx.fillStyle = "rgba(229,220,196,.46)";
    ctx.font = "24px ui-monospace, Consolas, monospace";
    ctx.fillText(body, 520, 552);
    ctx.restore();
  }

  actionLabel(id) {
    const makerState = MAKER_STATE_BY_ID.get(id);
    return ACTION_LABELS[id] || makerState?.label || id || "Sem estado";
  }

  animationMetaText(compact = false) {
    const animation = this.selectedAnimationData();
    if (!animation) return compact ? "sem frame data" : "Asset sem animacao selecionada.";
    const frame = animation.frames[Math.min(this.frameIndex, animation.frames.length - 1)] ?? 0;
    if (compact) return `${this.selectedActionId} | ${this.selectedAnimation} | row ${animation.row} | slot ${frame} | ${this.frameIndex + 1}/${animation.frames.length}`;
    return `acao ${this.selectedActionId} | sheet ${this.selectedAssetId} | row ${animation.row} | frames ${animation.frames.join(", ")} | ${animation.fps || 8} fps`;
  }

  assetDiagnostics(record) {
    if (!record.sheet) {
      return {
        missing: this.expectedStates(record),
        flags: [{ type: "warn", title: "Sem sheet", body: "Este asset ainda nao tem estados animados." }]
      };
    }
    const animationIds = Object.keys(record.sheet.animations || {});
    const expected = this.expectedStates(record);
    const missing = expected.filter((state) => !animationIds.includes(state));
    const flags = [];
    const signatures = new Map();
    for (const [id, animation] of Object.entries(record.sheet.animations || {})) {
      const issues = this.animationDiagnostics(record, id, animation);
      flags.push(...issues);
      const signature = `${animation.row}:${animation.frames.join(",")}`;
      if (!signatures.has(signature)) signatures.set(signature, []);
      signatures.get(signature).push(id);
    }
    for (const ids of signatures.values()) {
      if (ids.length > 1) {
        flags.push({
          type: "warn",
          title: "Sequencia duplicada",
          body: ids.join(" = ")
        });
      }
    }
    if (!flags.length) flags.push({ type: "ok", title: "OK", body: "Nenhum problema simples detectado." });
    return { missing, flags };
  }

  animationDiagnostics(record, id, animation) {
    const flags = [];
    if (!animation.frames?.length) {
      flags.push({ type: "danger", title: `${id}: sem frames`, body: "A animacao existe, mas nao aponta para frames." });
    }
    if (animation.frames?.length && new Set(animation.frames).size < animation.frames.length) {
      flags.push({ type: "warn", title: `${id}: frames repetidos`, body: animation.frames.join(", ") });
    }
    if (animation.frames?.some((slot) => slot < 0 || slot >= record.sheet.columns)) {
      flags.push({ type: "danger", title: `${id}: frame fora da grid`, body: `colunas 0-${record.sheet.columns - 1}` });
    }
    if (animation.row < 0 || animation.row >= record.sheet.rows) {
      flags.push({ type: "danger", title: `${id}: row fora da grid`, body: `rows 0-${record.sheet.rows - 1}` });
    }
    if ((animation.frames?.length || 0) <= 2) {
      flags.push({ type: "info", title: `${id}: muito curto`, body: "Pode funcionar como hold, mas tende a parecer placeholder." });
    }
    return flags;
  }

  expectedStates(record) {
    if (record.qaExpected?.length) return record.qaExpected;
    if (record.id === "silva" || record.id === "silvaActions") return PLAYER_EXPECTED;
    return ENEMY_EXPECTED;
  }

  promptForState(record, stateId) {
    const action = this.actionDefinition(stateId);
    return `SPRITESHEET TECH SPEC
Asset: ${record.label}
State/action: ${this.actionLabel(stateId)} (${stateId})
Action relationship: ${(action.from || []).join(", ")} -> ${stateId} -> ${(action.to || []).join(", ")}
Canvas per frame: use a padded frame with large transparent safety margin on every side.
Minimum alpha margin: 20% of frame width/height around the body for idle, walk, run, hit, and recovery.
Expanded alpha margin: 30-40% for attacks, jump, dash, grab, throw, hair, cloth, red sash, rope, machete arcs, dust, blood, smoke, and spiritual VFX.
Recommended frame cell: 320x320 px minimum for gameplay, 512x512 px preferred for future HD; increase beyond this for long horizontal or vertical strikes.
Long-strike spacing: if the machete, red sash, rope, slash arc, smoke, mud splash, blood, or VFX extends far from the body, enlarge the frame cell or add extra empty gutters so one frame never overlaps, leaks into, or appears inside a neighboring frame.
Character baseline: feet aligned to the same bottom guide in every frame.
Spacing: do not let weapon, hair, cloth, rope, slash arc, dust, blood, smoke, spirit aura, or VFX touch frame borders.
Alpha: transparent background only, premultiplied-clean PNG, no checkerboard baked into pixels, no matte color, no white halo, no edge fringe.
Sheet layout: evenly spaced grid with identical cell dimensions, generous gutters between cells when the generator cannot guarantee clean alpha at cell edges.
Motion: readable anticipation, active pose, follow-through, recovery.
Default action note: ${action.promptDefault}
Output: single transparent PNG spritesheet, evenly spaced grid, consistent lighting and scale.`;
  }
}
