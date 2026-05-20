import { acts } from "../data/acts.js";
import { assetManifest } from "../data/assets.js";
import { backgroundTests } from "../data/backgroundTests.js";
import { combatSystemRules, combatTimingFamilies, enemyStateMachine, playerFrameData, protagonistStateMachine } from "../data/combatTuning.js";
import { enemyClasses } from "../data/enemies.js";
import { makerCombatStates, makerPromptDefaults, makerQualityProfiles } from "../data/makerDefaults.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

const ALL_ASSETS = {
  ...assetManifest.characters,
  ...assetManifest.enemies,
  ...assetManifest.backgrounds,
  ...assetManifest.props
};

export class MakerPanel {
  constructor({ root, assets, audio, onBack }) {
    this.root = root;
    this.assets = assets;
    this.audio = audio;
    this.onBack = onBack;
    this.data = {
      assets: clone(assetManifest),
      enemies: clone(enemyClasses),
      acts: clone(acts),
      backgrounds: clone(backgroundTests),
      combat: {
        frameData: clone(playerFrameData),
        systemRules: clone(combatSystemRules),
        timingFamilies: clone(combatTimingFamilies),
        protagonistStateMachine: clone(protagonistStateMachine),
        enemyStateMachine: clone(enemyStateMachine)
      }
    };
    this.view = "characters";
    this.selectedAssetId = "silvaActions";
    this.selectedAnimation = "dashAttack";
    this.selectedEnemyId = "hunter";
    this.selectedSceneId = "margin-sentence-wave";
    this.frameIndex = 0;
    this.playing = true;
    this.lastTime = 0;
    this.accumulator = 0;
    this.raf = 0;
    this.previewImage = null;
    this.uploadedImages = new Map();
    this.quality = "gameplay";
    this.showSafe = true;
    this.showOnion = false;
    this.showChecker = false;
    this.zoom = 1.9;
    this.bind = this.bind.bind(this);
    this.animate = this.animate.bind(this);
  }

  start() {
    this.render();
    this.bind();
    this.loadSelectedImage();
    this.raf = requestAnimationFrame(this.animate);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
  }

  selectedRecord() {
    return ALL_ASSETS[this.selectedAssetId] || this.data.assets.characters.silvaActions;
  }

  selectedSheet() {
    return this.selectedRecord()?.sheet || null;
  }

  selectedAnimationData() {
    return this.selectedSheet()?.animations?.[this.selectedAnimation] || null;
  }

  render() {
    this.root.innerHTML = `
      <section class="screen maker-screen">
        <article class="maker-shell">
          <header class="maker-header">
            <div>
              <p class="eyebrow">Beat 'em up maker / AI backend</p>
              <h2>Meu Nome Nao E Silva Maker</h2>
              <p class="lead compact">Painel tecnico para revisar combate, sprites, estados, inimigos, cenarios e prompts de geracao. Edicoes aqui ficam em preview/export ate virarmos isso em pipeline de build.</p>
            </div>
            <div class="maker-header-actions">
              <button data-maker-action="export">Exportar JSON</button>
              <button data-maker-action="back">Voltar</button>
            </div>
          </header>

          <div class="maker-tabs" role="tablist" aria-label="Maker sections">
            ${this.tabButton("characters", "Personagens")}
            ${this.tabButton("combat", "Luta")}
            ${this.tabButton("enemies", "Inimigos")}
            ${this.tabButton("scenes", "Cenarios")}
            ${this.tabButton("prompts", "Prompts")}
          </div>

          <div class="maker-layout">
            <aside class="maker-sidebar">${this.renderSidebar()}</aside>
            <main class="maker-workbench">${this.renderWorkbench()}</main>
          </div>
        </article>
      </section>
    `;
  }

  tabButton(id, label) {
    return `<button class="${this.view === id ? "is-active" : ""}" data-maker-view="${id}">${label}</button>`;
  }

  renderSidebar() {
    if (this.view === "characters") return this.renderCharacterSidebar();
    if (this.view === "combat") return this.renderCombatSidebar();
    if (this.view === "enemies") return this.renderEnemySidebar();
    if (this.view === "scenes") return this.renderSceneSidebar();
    return this.renderPromptSidebar();
  }

  renderWorkbench() {
    if (this.view === "characters") return this.renderCharacterWorkbench();
    if (this.view === "combat") return this.renderCombatWorkbench();
    if (this.view === "enemies") return this.renderEnemyWorkbench();
    if (this.view === "scenes") return this.renderSceneWorkbench();
    return this.renderPromptWorkbench();
  }

  renderCharacterSidebar() {
    const characterRecords = Object.values(this.data.assets.characters);
    return `
      <section class="maker-panel">
        <h3>Personagens / sheets</h3>
        <p class="maker-comment">Clique em uma sheet para revisar estados, recorte, alpha, FPS e prompt tecnico default. Silva continua sendo o unico jogavel por enquanto.</p>
        <div class="maker-list">
          ${characterRecords
            .map(
              (record) => `
                <button class="maker-list-item ${record.id === this.selectedAssetId ? "is-active" : ""}" data-select-asset="${record.id}">
                  <strong>${record.label}</strong>
                  <span>${record.sheet ? `${record.sheet.columns}x${record.sheet.rows} | ${record.sheet.frameWidth}x${record.sheet.frameHeight}` : "single image"}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
      ${this.renderViewerControls()}
    `;
  }

  renderCombatSidebar() {
    return `
      <section class="maker-panel">
        <h3>Estados de luta</h3>
        <p class="maker-comment">Mapa tecnico estilo Streets of Rage: comando, funcao, status no prototipo e prompt para pedir sprites faltantes.</p>
        <div class="maker-list compact">
          ${makerCombatStates
            .map(
              (state) => `
                <button class="maker-list-item ${state.id === this.selectedAnimation ? "is-active" : ""}" data-select-combat-state="${state.id}">
                  <strong>${state.label}</strong>
                  <span>${state.command} | ${state.systemic ? "sistemico" : "placeholder"}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderEnemySidebar() {
    return `
      <section class="maker-panel">
        <h3>Classes inimigas</h3>
        <p class="maker-comment">Cada inimigo e uma classe expansivel. Edite valores para testar fantasia de comportamento antes de consolidar no codigo.</p>
        <div class="maker-list">
          ${Object.values(this.data.enemies)
            .map(
              (enemy) => `
                <button class="maker-list-item ${enemy.id === this.selectedEnemyId ? "is-active" : ""}" data-select-enemy="${enemy.id}">
                  <strong>${enemy.displayName}</strong>
                  <span>${enemy.faction} | ${enemy.assetId}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderSceneSidebar() {
    const scenes = this.data.acts.flatMap((act) => (act.scenes || []).map((scene) => ({ ...scene, actTitle: act.title })));
    return `
      <section class="maker-panel">
        <h3>Cenarios / fases</h3>
        <p class="maker-comment">Visualize estrutura de fase, fundos, limites, props e ondas. Use isto para planejar scrolling e plates longos.</p>
        <div class="maker-list">
          ${scenes
            .map(
              (scene) => `
                <button class="maker-list-item ${scene.id === this.selectedSceneId ? "is-active" : ""}" data-select-scene="${scene.id}">
                  <strong>${scene.title}</strong>
                  <span>${scene.actTitle}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderPromptSidebar() {
    return `
      <section class="maker-panel">
        <h3>Prompts default</h3>
        <p class="maker-comment">Prompts tecnicos para manter escala, alpha, margem e estrutura. A arte fina entra como bloco separado.</p>
        <div class="maker-list compact">
          ${Object.entries(makerPromptDefaults)
            .map(
              ([key]) => `
                <button class="maker-list-item ${key === "spriteSheet" ? "is-active" : ""}" data-scroll-prompt="${key}">
                  <strong>${this.promptTitle(key)}</strong>
                  <span>template tecnico</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderViewerControls() {
    const sheet = this.selectedSheet();
    const animations = sheet?.animations || {};
    return `
      <section class="maker-panel">
        <h3>Viewer</h3>
        <label class="maker-field">
          <span>Estado / animacao</span>
          <select data-maker-input="selectedAnimation">
            ${Object.keys(animations)
              .map((id) => `<option value="${id}" ${id === this.selectedAnimation ? "selected" : ""}>${id}</option>`)
              .join("")}
          </select>
        </label>
        <label class="maker-field">
          <span>Qualidade de preview</span>
          <select data-maker-input="quality">
            ${Object.entries(makerQualityProfiles)
              .map(([id, profile]) => `<option value="${id}" ${id === this.quality ? "selected" : ""}>${profile.label}</option>`)
              .join("")}
          </select>
          <small>${makerQualityProfiles[this.quality].comment}</small>
        </label>
        <label class="maker-field">
          <span>Zoom</span>
          <input type="range" min="0.75" max="3.8" step="0.05" value="${this.zoom}" data-maker-input="zoom" />
        </label>
        <label class="maker-check"><input type="checkbox" ${this.showSafe ? "checked" : ""} data-maker-input="showSafe" /> Safe area / overflow</label>
        <label class="maker-check"><input type="checkbox" ${this.showOnion ? "checked" : ""} data-maker-input="showOnion" /> Onion skin</label>
        <label class="maker-check"><input type="checkbox" ${this.showChecker ? "checked" : ""} data-maker-input="showChecker" /> Checker alpha</label>
        <div class="maker-row">
          <button data-maker-action="play">${this.playing ? "Pausar" : "Tocar"}</button>
          <button data-maker-action="step">Prox. frame</button>
        </div>
        <label class="maker-field file-field">
          <span>Substituir asset no preview</span>
          <input type="file" accept="image/png,image/*" data-maker-file="asset" />
          <small>Comentario: cria uma URL local temporaria. Nao altera o arquivo do projeto ate exportarmos/aplicarmos.</small>
        </label>
      </section>
    `;
  }

  renderCharacterWorkbench() {
    const record = this.selectedRecord();
    const sheet = record.sheet;
    const animation = this.selectedAnimationData();
    return `
      <section class="maker-grid">
        <div class="maker-preview-card">
          <div class="maker-preview-toolbar">
            <span>${record.label}</span>
            <span>${record.src}</span>
          </div>
          <canvas class="maker-canvas" width="1920" height="1080" data-maker-canvas></canvas>
        </div>
        <div class="maker-panel">
          <h3>Estado selecionado</h3>
          ${
            sheet && animation
              ? `
                <label class="maker-field"><span>Row</span><input type="number" min="0" value="${animation.row}" data-edit-animation="row" /></label>
                <label class="maker-field"><span>Frames</span><input value="${animation.frames.join(",")}" data-edit-animation="frames" /></label>
                <label class="maker-field"><span>FPS</span><input type="number" min="1" max="60" value="${animation.fps}" data-edit-animation="fps" /></label>
                <label class="maker-check"><input type="checkbox" ${animation.loop ? "checked" : ""} data-edit-animation="loop" /> Loop</label>
              `
              : "<p class='maker-comment'>Este asset ainda nao tem sheet configurada.</p>"
          }
          <h3>Sheet config</h3>
          ${
            sheet
              ? `
                <div class="maker-stats">
                  <span>columns <strong>${sheet.columns}</strong></span>
                  <span>rows <strong>${sheet.rows}</strong></span>
                  <span>frame <strong>${sheet.frameWidth}x${sheet.frameHeight}</strong></span>
                  <span>nominal <strong>${sheet.nominalFrameWidth || sheet.frameWidth}x${sheet.nominalFrameHeight || sheet.frameHeight}</strong></span>
                </div>
              `
              : ""
          }
          <p class="maker-comment">Prompt default para substituir este estado com margem futura:</p>
          <textarea class="maker-prompt" readonly>${this.statePrompt(this.selectedAnimation)}</textarea>
        </div>
      </section>
    `;
  }

  renderCombatWorkbench() {
    const selected = makerCombatStates.find((state) => state.id === this.selectedAnimation) || makerCombatStates[0];
    const implemented = this.findAnimationOwner(selected.id);
    const frameData = this.frameDataForState(selected.id);
    return `
      <section class="maker-panel wide-panel">
        <h3>${selected.label}</h3>
        <div class="maker-stats">
          <span>Comando <strong>${selected.command}</strong></span>
          <span>Status <strong>${selected.systemic ? "sistemico" : "placeholder"}</strong></span>
          <span>Asset atual <strong>${implemented || "sem sprite dedicado"}</strong></span>
          <span>Frame data <strong>${frameData?.label || "planejado"}</strong></span>
        </div>
        ${frameData ? this.renderFrameData(frameData) : ""}
        <p class="maker-comment">${selected.comment}</p>
        <textarea class="maker-prompt" readonly>${this.statePrompt(selected.id, selected.promptHint)}</textarea>
      </section>
      <section class="maker-panel wide-panel">
        <h3>Mapa minimo de maquina de estados</h3>
        <div class="maker-state-map">
          ${makerCombatStates
            .map(
              (state) => `
                <button class="${state.id === selected.id ? "is-active" : ""}" data-select-combat-state="${state.id}">
                  <strong>${state.label}</strong>
                  <small>${state.command}</small>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="maker-grid">
        <div class="maker-panel">
          <h3>Regras sistemicas</h3>
          <p class="maker-comment">${combatSystemRules.spirit.comment}</p>
          <div class="maker-stats">
            <span>Pulse <strong>${combatSystemRules.spirit.costs.pulse}</strong></span>
            <span>Especial ofensivo <strong>${combatSystemRules.spirit.costs.offensiveSpecial}</strong></span>
            <span>Dodge cancel <strong>${combatSystemRules.spirit.costs.dodgeCancel}</strong></span>
            <span>Sentenca <strong>${combatSystemRules.sentence.enabled ? "ativa" : "planejada"}</strong></span>
          </div>
          <p class="maker-comment">${combatSystemRules.sentence.comment}</p>
        </div>
        <div class="maker-panel">
          <h3>Timing por familia</h3>
          <div class="maker-wave-list">
            ${Object.entries(combatTimingFamilies)
              .map(([key, family]) => `<div><strong>${key}: ${family.fps} fps</strong><span>${family.frames} | ${family.note}</span></div>`)
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  renderFrameData(frameData) {
    return `
      <div class="maker-frame-data">
        <span><strong>${frameData.startup}f</strong> startup</span>
        <span><strong>${frameData.active}f</strong> active</span>
        <span><strong>${frameData.recovery}f</strong> recovery</span>
        <span><strong>${frameData.onHit}</strong> on hit</span>
        <span><strong>${frameData.onMiss}</strong> miss/block</span>
        <span><strong>${frameData.cancelTo?.join(", ") || "none"}</strong> cancels</span>
      </div>
      <p class="maker-comment">${frameData.note}</p>
    `;
  }

  renderEnemyWorkbench() {
    const enemy = this.data.enemies[this.selectedEnemyId];
    const record = ALL_ASSETS[enemy.assetId];
    return `
      <section class="maker-grid">
        <div class="maker-panel">
          <h3>${enemy.displayName}</h3>
          <p class="maker-comment">${enemy.role}</p>
          <div class="maker-form-grid">
            ${["body", "speed", "depthSpeed", "reach", "damage", "attackWindup", "attackCooldown", "hitStun", "knockback"]
              .map(
                (key) => `
                  <label class="maker-field">
                    <span>${key}</span>
                    <input type="number" step="0.01" value="${enemy[key]}" data-edit-enemy="${key}" />
                  </label>
                `
              )
              .join("")}
          </div>
          <label class="maker-field"><span>AssetId</span><input value="${enemy.assetId}" data-edit-enemy="assetId" /></label>
          <p class="maker-comment">Comentario: estes valores definem fantasia de IA. Depois podemos ligar esta tela para gravar direto em <code>src/data/enemies.js</code>.</p>
        </div>
        <div class="maker-panel">
          <h3>Sprite / prompt</h3>
          <div class="maker-stats">
            <span>Sheet <strong>${record?.label || "missing"}</strong></span>
            <span>Faction <strong>${enemy.faction}</strong></span>
          </div>
          <textarea class="maker-prompt" readonly>${makerPromptDefaults.enemySheet}</textarea>
        </div>
      </section>
    `;
  }

  renderSceneWorkbench() {
    const scene = this.findScene(this.selectedSceneId);
    const background = scene?.backgroundId ? ALL_ASSETS[scene.backgroundId] : null;
    const waves = scene?.waves || [];
    return `
      <section class="maker-grid">
        <div class="maker-panel">
          <h3>${scene?.title || "Scene"}</h3>
          <div class="maker-stats">
            <span>Bounds <strong>${scene.bounds.left}-${scene.bounds.right}</strong></span>
            <span>Lanes <strong>${scene.bounds.topLane}-${scene.bounds.bottomLane}</strong></span>
            <span>Props <strong>${scene.props?.length || 0}</strong></span>
            <span>Waves <strong>${waves.length}</strong></span>
          </div>
          <p class="maker-comment">${scene?.objective || ""}</p>
          <label class="maker-field"><span>BackgroundId</span><input value="${scene?.backgroundId || "constructed"}" readonly /></label>
          <label class="maker-field"><span>Modo</span><input value="${scene?.backgroundMode || "constructed"}" readonly /></label>
          <textarea class="maker-prompt" readonly>${makerPromptDefaults.backgroundPlate}</textarea>
        </div>
        <div class="maker-panel">
          <h3>Ondas</h3>
          <div class="maker-wave-list">
            ${waves
              .map(
                (wave) => `
                  <div>
                    <strong>${wave.label || wave.id}</strong>
                    <span>${wave.spawns.map((spawn) => `${spawn.enemyClass}@${spawn.x}`).join(" | ")}</span>
                  </div>
                `
              )
              .join("")}
          </div>
          <h3>Fundos de teste</h3>
          <div class="maker-list compact">
            ${this.data.backgrounds
              .map((bg) => `<button class="maker-list-item"><strong>${bg.title}</strong><span>${bg.loadingText}</span></button>`)
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  renderPromptWorkbench() {
    return `
      <section class="maker-panel wide-panel">
        <h3>Biblioteca de prompts tecnicos</h3>
        <p class="maker-comment">Copie estes blocos e acrescente a direcao artistica especifica do personagem, inimigo ou cenario. A parte tecnica deve continuar igual para preservar pipeline.</p>
        ${Object.entries(makerPromptDefaults)
          .map(
            ([key, prompt]) => `
              <article class="maker-prompt-block" data-prompt-block="${key}">
                <h3>${this.promptTitle(key)}</h3>
                <textarea class="maker-prompt" readonly>${prompt}</textarea>
              </article>
            `
          )
          .join("")}
      </section>
    `;
  }

  bind() {
    this.root.querySelectorAll("[data-maker-view]").forEach((button) => {
      button.addEventListener("click", () => {
        this.audio?.play("menuSelect", 0.7);
        this.view = button.dataset.makerView;
        if (this.view === "characters") this.selectedAssetId = this.selectedAssetId || "silvaActions";
        this.render();
        this.bind();
        this.loadSelectedImage();
      });
    });

    this.root.querySelector("[data-maker-action='back']")?.addEventListener("click", () => this.onBack?.());
    this.root.querySelector("[data-maker-action='export']")?.addEventListener("click", () => this.exportConfig());

    this.root.querySelectorAll("[data-select-asset]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedAssetId = button.dataset.selectAsset;
        const animations = Object.keys(this.selectedSheet()?.animations || {});
        this.selectedAnimation = animations.includes(this.selectedAnimation) ? this.selectedAnimation : animations[0] || "idle";
        this.frameIndex = 0;
        this.render();
        this.bind();
        this.loadSelectedImage();
      });
    });

    this.root.querySelectorAll("[data-select-combat-state]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedAnimation = button.dataset.selectCombatState;
        this.render();
        this.bind();
        this.loadSelectedImage();
      });
    });

    this.root.querySelectorAll("[data-select-enemy]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedEnemyId = button.dataset.selectEnemy;
        this.render();
        this.bind();
      });
    });

    this.root.querySelectorAll("[data-select-scene]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedSceneId = button.dataset.selectScene;
        this.render();
        this.bind();
      });
    });

    this.root.querySelector("[data-maker-action='play']")?.addEventListener("click", () => {
      this.playing = !this.playing;
      this.render();
      this.bind();
      this.loadSelectedImage();
    });
    this.root.querySelector("[data-maker-action='step']")?.addEventListener("click", () => {
      this.nextFrame();
      this.draw();
    });

    this.root.querySelectorAll("[data-maker-input]").forEach((input) => {
      input.addEventListener("input", () => this.handleViewerInput(input));
    });

    this.root.querySelectorAll("[data-edit-animation]").forEach((input) => {
      input.addEventListener("input", () => this.handleAnimationEdit(input));
    });

    this.root.querySelectorAll("[data-edit-enemy]").forEach((input) => {
      input.addEventListener("input", () => this.handleEnemyEdit(input));
    });

    this.root.querySelector("[data-maker-file='asset']")?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        this.uploadedImages.set(this.selectedAssetId, image);
        this.previewImage = image;
        this.draw();
      };
      image.src = url;
    });
  }

  handleViewerInput(input) {
    const key = input.dataset.makerInput;
    if (key === "selectedAnimation") {
      this.selectedAnimation = input.value;
      this.frameIndex = 0;
    }
    if (key === "quality") this.quality = input.value;
    if (key === "zoom") this.zoom = Number(input.value);
    if (key === "showSafe") this.showSafe = input.checked;
    if (key === "showOnion") this.showOnion = input.checked;
    if (key === "showChecker") this.showChecker = input.checked;
    this.draw();
  }

  handleAnimationEdit(input) {
    const animation = this.selectedAnimationData();
    if (!animation) return;
    const key = input.dataset.editAnimation;
    if (key === "row") animation.row = Number(input.value);
    if (key === "frames") animation.frames = input.value.split(",").map((item) => Number(item.trim())).filter((item) => Number.isFinite(item));
    if (key === "fps") animation.fps = Number(input.value);
    if (key === "loop") animation.loop = input.checked;
    this.frameIndex = Math.min(this.frameIndex, Math.max(0, animation.frames.length - 1));
    this.draw();
  }

  handleEnemyEdit(input) {
    const enemy = this.data.enemies[this.selectedEnemyId];
    const key = input.dataset.editEnemy;
    const numeric = Number(input.value);
    enemy[key] = Number.isFinite(numeric) && input.type === "number" ? numeric : input.value;
  }

  loadSelectedImage() {
    const uploaded = this.uploadedImages.get(this.selectedAssetId);
    if (uploaded) {
      this.previewImage = uploaded;
      this.draw();
      return;
    }
    this.previewImage = this.assets.image(this.selectedAssetId) || null;
    this.draw();
  }

  animate(time) {
    const animation = this.selectedAnimationData();
    if (this.playing && animation && this.previewImage) {
      const dt = time - (this.lastTime || time);
      this.accumulator += dt;
      const stepMs = 1000 / Math.max(1, animation.fps || 8);
      if (this.accumulator >= stepMs) {
        this.nextFrame();
        this.accumulator = 0;
      }
    }
    this.lastTime = time;
    this.draw();
    this.raf = requestAnimationFrame(this.animate);
  }

  nextFrame() {
    const animation = this.selectedAnimationData();
    if (!animation?.frames?.length) return;
    if (animation.loop) this.frameIndex = (this.frameIndex + 1) % animation.frames.length;
    else this.frameIndex = Math.min(animation.frames.length - 1, this.frameIndex + 1);
  }

  draw() {
    const canvas = this.root.querySelector("[data-maker-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const profile = makerQualityProfiles[this.quality] || makerQualityProfiles.gameplay;
    ctx.imageSmoothingEnabled = profile.smoothing;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBackground(ctx, canvas);
    this.drawGuides(ctx, canvas);
    this.drawSpritePreview(ctx, canvas);
  }

  drawBackground(ctx, canvas) {
    if (this.showChecker) {
      const size = 48;
      for (let y = 0; y < canvas.height; y += size) {
        for (let x = 0; x < canvas.width; x += size) {
          ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? "#d8d8d8" : "#b8b8b8";
          ctx.fillRect(x, y, size, size);
        }
      }
      return;
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#081014");
    gradient.addColorStop(0.55, "#11140f");
    gradient.addColorStop(1, "#21170f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,.42)";
    ctx.fillRect(0, canvas.height * 0.58, canvas.width, canvas.height * 0.42);
  }

  drawGuides(ctx, canvas) {
    if (!this.showSafe) return;
    ctx.save();
    ctx.strokeStyle = "rgba(229,220,196,.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 90, canvas.width - 320, canvas.height - 180);
    ctx.strokeStyle = "rgba(217,147,69,.72)";
    ctx.beginPath();
    ctx.moveTo(0, 820);
    ctx.lineTo(canvas.width, 820);
    ctx.stroke();
    ctx.fillStyle = "rgba(217,147,69,.82)";
    ctx.font = "22px ui-monospace, Consolas, monospace";
    ctx.fillText("ground / lane reference", 24, 792);
    ctx.restore();
  }

  drawSpritePreview(ctx) {
    const image = this.previewImage;
    const sheet = this.selectedSheet();
    const animation = this.selectedAnimationData();
    if (!image || !sheet || !animation) return;
    const frameSlot = animation.frames[Math.min(this.frameIndex, animation.frames.length - 1)] || 0;
    const sx = frameSlot * sheet.frameWidth + (sheet.sourceInset || 0);
    const sy = animation.row * sheet.frameHeight + (sheet.sourceInset || 0);
    const sw = sheet.frameWidth - (sheet.sourceInset || 0) * 2;
    const sh = sheet.frameHeight - (sheet.sourceInset || 0) * 2;
    const nominalW = sheet.nominalFrameWidth || sheet.frameWidth;
    const nominalH = sheet.nominalFrameHeight || sheet.frameHeight;
    const scale = this.zoom * (260 / nominalH);
    const dw = sw * scale;
    const dh = sh * scale;
    const padX = Math.max(0, (sheet.frameWidth - nominalW) / 2 - (sheet.sourceInset || 0));
    const padY = Math.max(0, (sheet.frameHeight - nominalH) / 2 - (sheet.sourceInset || 0));
    const footX = 960;
    const footY = 820;
    const dx = footX - nominalW * scale * 0.5 - padX * scale;
    const dy = footY - nominalH * scale - padY * scale;

    if (this.showOnion && animation.frames.length > 1) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      const prevSlot = animation.frames[(Math.max(0, this.frameIndex - 1))] || frameSlot;
      const nextSlot = animation.frames[(Math.min(animation.frames.length - 1, this.frameIndex + 1))] || frameSlot;
      ctx.drawImage(image, prevSlot * sheet.frameWidth, sy, sheet.frameWidth, sheet.frameHeight, dx - 90, dy, dw, dh);
      ctx.drawImage(image, nextSlot * sheet.frameWidth, sy, sheet.frameWidth, sheet.frameHeight, dx + 90, dy, dw, dh);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.34)";
    ctx.beginPath();
    ctx.ellipse(footX, footY + 16, 170 * this.zoom, 28 * this.zoom, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();

    if (this.showSafe) {
      ctx.save();
      ctx.strokeStyle = "rgba(54,216,163,.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(footX - nominalW * scale * 0.5, footY - nominalH * scale, nominalW * scale, nominalH * scale);
      ctx.strokeStyle = "rgba(217,147,69,.42)";
      ctx.strokeRect(dx, dy, dw, dh);
      ctx.restore();
    }
  }

  statePrompt(stateId, overrideHint = "") {
    const state = makerCombatStates.find((item) => item.id === stateId);
    return `${makerPromptDefaults.spriteSheet}

Movement state: ${state?.label || stateId}
Command: ${state?.command || "configured in sheet"}
Gameplay comment: ${state?.comment || "Use current animation timing."}
Frame beats: ${overrideHint || state?.promptHint || "8 readable frames with anticipation, active pose, follow-through, and recovery."}`;
  }

  findAnimationOwner(animationId) {
    const records = [...Object.values(this.data.assets.characters), ...Object.values(this.data.assets.enemies)];
    return records.find((record) => record.sheet?.animations?.[animationId])?.id || "";
  }

  findScene(sceneId) {
    return this.data.acts.flatMap((act) => act.scenes || []).find((scene) => scene.id === sceneId);
  }

  frameDataForState(stateId) {
    const map = {
      lightChain: "light1",
      dashAttack: "dashAttack",
      launcher: "launcher",
      airNeutral: "airSlash",
      airForward: "airSlash",
      airDown: "airSlash",
      grabFront: "grabStart",
      specialDefensive: "spiritPulse",
      specialOffensive: "redSashSpecial"
    };
    return playerFrameData[map[stateId] || stateId] || null;
  }

  promptTitle(key) {
    return {
      spriteSheet: "Sprite sheet de personagem",
      enemySheet: "Sprite sheet de inimigo",
      backgroundPlate: "Fundo 16:9 / scrolling",
      propAtlas: "Atlas de props"
    }[key] || key;
  }

  exportConfig() {
    const payload = {
      exportedAt: new Date().toISOString(),
      note: "Preview/export from in-game maker. Review before applying to source files.",
      selectedAssetId: this.selectedAssetId,
      selectedAnimation: this.selectedAnimation,
      data: this.data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mnes-maker-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }
}
