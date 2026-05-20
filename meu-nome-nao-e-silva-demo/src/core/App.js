import { acts } from "../data/acts.js";
import { backgroundTests } from "../data/backgroundTests.js";
import { confrontationDialogues } from "../data/dialogues.js";
import { introSlides } from "../data/introSlides.js";
import { locations } from "../data/locations.js";
import { AudioBus } from "./AudioBus.js";
import { AssetRegistry } from "./AssetRegistry.js";
import { GameEngine } from "./GameEngine.js";
import { IntroSequence } from "./IntroSequence.js";
import { MakerPanel } from "./MakerPanel.js";
import { StateCyclerPanel } from "./StateCyclerPanel.js";

export class PrototypeApp {
  constructor(root) {
    this.root = root;
    this.assets = new AssetRegistry();
    this.audio = new AudioBus(window);
    this.audio.setMusic("assets/audio/o-rio-sabe-theme.mp3");
    this.audio.setStartCue("assets/audio/press-start-placeholder.mp3");
    this.engine = null;
    this.intro = null;
    this.maker = null;
    this.stateCycler = null;
    this.selectedAct = acts[0];
    this.selectedScene = acts[0].scenes[0];
    this.fullscreenBound = false;
    this.dialogue = null;
    this.dialogueIndex = 0;
    this.dialogueTimer = 0;
    this.dialoguePreviousGamepadPressed = false;
    this.dialogueCleanup = null;
    this.menuRaf = 0;
    this.menuGamepad = {
      previousButtons: new Set(),
      previousMove: "",
      lastMoveAt: 0
    };
    this.handleRootClick = this.handleRootClick.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.pollMenuGamepad = this.pollMenuGamepad.bind(this);
  }

  async boot() {
    this.bindStageControls();
    this.renderLoading();
    await this.assets.preload();
    if (window.location.search.includes("state-cycler") || window.location.search.includes("cycler")) {
      this.renderStateCycler();
      return;
    }
    if (window.location.search.includes("maker")) {
      this.renderMaker();
      return;
    }
    if (window.location.search.includes("title")) {
      this.renderTitle();
      return;
    }
    this.selectedScene = this.createDemoScene();
    this.renderConfrontationIntro();
    return;
  }

  bindStageControls() {
    if (this.fullscreenBound) return;
    this.fullscreenBound = true;
    this.root.addEventListener("click", this.handleRootClick);
    document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    this.menuRaf = requestAnimationFrame(this.pollMenuGamepad);
  }

  handleRootClick(event) {
    const button = event.target.closest?.("[data-action='fullscreen']");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    this.toggleFullscreen();
  }

  async toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await this.root.requestFullscreen({ navigationUI: "hide" });
      }
    } catch {
      // Some browsers reject navigationUI; retry with the plain Fullscreen API.
      if (!document.fullscreenElement) await this.root.requestFullscreen();
    }
  }

  handleFullscreenChange() {
    this.syncFullscreenButton();
    setTimeout(() => this.engine?.resize(), 80);
  }

  mountFullscreenButton() {
    if (!document.fullscreenEnabled) return;
    const stage = this.root.querySelector(".screen, .game-shell, .intro-screen");
    if (!stage || stage.querySelector("[data-action='fullscreen']")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fullscreen-toggle";
    button.dataset.action = "fullscreen";
    stage.appendChild(button);
    this.syncFullscreenButton();
  }

  syncFullscreenButton() {
    const isFullscreen = Boolean(document.fullscreenElement);
    for (const button of this.root.querySelectorAll("[data-action='fullscreen']")) {
      button.textContent = isFullscreen ? "Sair da tela cheia" : "Tela cheia";
      button.setAttribute("aria-label", isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia");
      button.setAttribute("title", isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia");
      button.classList.toggle("is-fullscreen", isFullscreen);
    }
  }

  pollMenuGamepad(time) {
    this.handleMenuGamepad(time);
    this.menuRaf = requestAnimationFrame(this.pollMenuGamepad);
  }

  handleMenuGamepad(time) {
    if (this.engine || this.intro || this.dialogue || typeof navigator === "undefined") return;
    const pad = Array.from(navigator.getGamepads?.() || []).find((item) => item?.connected);
    if (!pad) {
      this.menuGamepad.previousButtons.clear();
      this.menuGamepad.previousMove = "";
      return;
    }

    const buttons = new Set();
    pad.buttons.forEach((button, index) => {
      if (button.pressed) buttons.add(index);
    });

    const justPressed = (index) => buttons.has(index) && !this.menuGamepad.previousButtons.has(index);
    const axisX = Math.abs(pad.axes[0] || 0) > 0.45 ? Math.sign(pad.axes[0]) : 0;
    const axisY = Math.abs(pad.axes[1] || 0) > 0.45 ? Math.sign(pad.axes[1]) : 0;
    const move =
      buttons.has(12) || axisY < 0
        ? "up"
        : buttons.has(13) || axisY > 0
          ? "down"
          : buttons.has(14) || axisX < 0
            ? "left"
            : buttons.has(15) || axisX > 0
              ? "right"
              : "";

    if (move && (move !== this.menuGamepad.previousMove || time - this.menuGamepad.lastMoveAt > 220)) {
      this.moveMenuFocus(move);
      this.menuGamepad.lastMoveAt = time;
      this.audio?.play("menuMove", 0.55);
    }
    this.menuGamepad.previousMove = move;

    if (justPressed(0) || justPressed(2) || justPressed(9)) this.activateFocusedMenuButton();
    if (justPressed(1) || justPressed(8)) this.activateBackButton();

    this.menuGamepad.previousButtons = buttons;
  }

  menuButtons() {
    return Array.from(this.root.querySelectorAll("button:not(:disabled)")).filter((button) => this.isMenuButtonVisible(button));
  }

  isMenuButtonVisible(button) {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  focusFirstMenuButton(preferredSelector = ".primary, [data-action='continue'], [data-action='start']") {
    setTimeout(() => {
      const preferred = Array.from(this.root.querySelectorAll(preferredSelector)).find(
        (button) => !button.disabled && this.isMenuButtonVisible(button)
      );
      const fallback = this.menuButtons().find((button) => button.dataset.action !== "fullscreen") || this.menuButtons()[0];
      this.focusMenuButton(preferred || fallback);
    }, 80);
  }

  focusMenuButton(button) {
    if (!button) return;
    for (const item of this.root.querySelectorAll(".is-gamepad-focus")) item.classList.remove("is-gamepad-focus");
    button.classList.add("is-gamepad-focus");
    button.focus({ preventScroll: true });
  }

  moveMenuFocus(direction) {
    const buttons = this.menuButtons();
    if (!buttons.length) return;
    const active = buttons.includes(document.activeElement) ? document.activeElement : null;
    if (!active) {
      this.focusMenuButton(buttons.find((button) => button.dataset.action !== "fullscreen") || buttons[0]);
      return;
    }

    const current = this.centerOf(active);
    const candidates = buttons.filter((button) => button !== active);
    const directional = candidates
      .map((button) => {
        const center = this.centerOf(button);
        const dx = center.x - current.x;
        const dy = center.y - current.y;
        const inDirection =
          (direction === "right" && dx > 8) ||
          (direction === "left" && dx < -8) ||
          (direction === "down" && dy > 8) ||
          (direction === "up" && dy < -8);
        if (!inDirection) return null;
        const score =
          direction === "left" || direction === "right"
            ? Math.abs(dx) + Math.abs(dy) * 1.8
            : Math.abs(dy) + Math.abs(dx) * 1.45;
        return { button, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score);

    if (directional[0]) {
      this.focusMenuButton(directional[0].button);
      return;
    }

    const index = buttons.indexOf(active);
    const step = direction === "left" || direction === "up" ? -1 : 1;
    this.focusMenuButton(buttons[(index + step + buttons.length) % buttons.length]);
  }

  centerOf(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
  }

  activateFocusedMenuButton() {
    const pressStart = this.root.querySelector(".title-screen:not(.has-started) [data-action='press-start']");
    if (pressStart && this.isMenuButtonVisible(pressStart)) {
      pressStart.click();
      this.focusFirstMenuButton("[data-action='start']");
      return;
    }

    const buttons = this.menuButtons();
    const active = buttons.includes(document.activeElement) ? document.activeElement : null;
    if (!active) {
      this.focusFirstMenuButton();
      return;
    }
    active.click();
  }

  activateBackButton() {
    const back = Array.from(this.root.querySelectorAll("[data-action='back'], [data-action='title']")).find(
      (button) => !button.disabled && this.isMenuButtonVisible(button)
    );
    if (!back) return;
    this.focusMenuButton(back);
    back.click();
  }

  clearEngine() {
    if (this.engine) {
      this.engine.stop();
      this.engine = null;
    }
  }

  clearIntro() {
    if (this.intro) {
      this.intro.dispose();
      this.intro = null;
    }
  }

  clearDialogue() {
    if (this.dialogueTimer) clearTimeout(this.dialogueTimer);
    this.dialogueTimer = 0;
    this.dialogue = null;
    this.dialogueCleanup?.();
    this.dialogueCleanup = null;
  }

  clearMaker() {
    if (this.maker) {
      this.maker.dispose();
      this.maker = null;
    }
  }

  clearStateCycler() {
    if (this.stateCycler) {
      this.stateCycler.dispose();
      this.stateCycler = null;
    }
  }

  renderLoading() {
    this.clearMaker();
    this.clearStateCycler();
    this.root.innerHTML = `
      <section class="screen">
        <article class="story-card">
          <p class="eyebrow">Prototype v0.01</p>
          <h2>Carregando a margem</h2>
          <p>The build is assembling placeholder plates, combat data, and act structure.</p>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
  }

  renderTitle() {
    this.clearDialogue();
    this.clearIntro();
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    this.root.innerHTML = `
      <section class="screen title-screen">
        <div class="title-video-stage" aria-hidden="true">
          <img class="menu-video-fallback" src="assets/backgrounds/act1-margin-riverbank-v01.png" alt="" />
          <video class="menu-video" src="assets/videos/river-menu-placeholder.mp4" poster="assets/backgrounds/act1-margin-riverbank-v01.png" autoplay muted loop playsinline preload="auto"></video>
        </div>
        <div class="title-intro" data-title-intro>
          <img class="game-logo" src="assets/ui/game-logo-v01.png?v=alpha-002" alt="Meu Nome Não É Silva" />
          <button class="press-start" data-action="press-start">Press Start</button>
        </div>
        <article class="title-shell title-menu" data-title-menu>
          <div>
            <p class="eyebrow">2.5D beat 'em up vertical-thinking prototype</p>
            <p class="lead">The defenseless becomes the feared. This rough playable slice tests whether body, spirit, community, and narrative can live inside one combat fantasy.</p>
            <div class="action-row">
              <button class="primary" data-action="start">Start Prototype</button>
              <button data-action="intro">Ver Intro</button>
              <button data-action="backgrounds">Testar Fundos</button>
              <button data-action="acts">Act Structure</button>
              <button data-action="maker">Backend Maker</button>
              <button data-action="state-cycler">Ciclar Estados</button>
            </div>
            <p class="meta">Focus slice: Act I, Margin of Sentence, jungle riverbank pursuit.</p>
          </div>
          <img class="menu-logo" src="assets/ui/game-logo-v01.png?v=alpha-002" alt="" aria-hidden="true" />
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-action='press-start']");
    this.bindTitleStart();
    this.root.querySelector("[data-action='start']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderStory("pre");
    });
    this.root.querySelector("[data-action='acts']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderActs();
    });
    this.root.querySelector("[data-action='intro']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderIntro();
    });
    this.root.querySelector("[data-action='backgrounds']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderBackgroundTests();
    });
    this.root.querySelector("[data-action='maker']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderMaker();
    });
    this.root.querySelector("[data-action='state-cycler']").addEventListener("click", async () => {
      await this.ensureAudioStarted();
      this.audio.play("menuSelect");
      this.renderStateCycler();
    });
  }

  renderMaker() {
    this.clearDialogue();
    this.clearEngine();
    this.clearIntro();
    this.clearMaker();
    this.clearStateCycler();
    this.maker = new MakerPanel({
      root: this.root,
      assets: this.assets,
      audio: this.audio,
      onBack: () => {
        this.audio.play("menuSelect");
        this.renderTitle();
      }
    });
    this.maker.start();
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-maker-view]");
  }

  renderStateCycler() {
    this.clearDialogue();
    this.clearEngine();
    this.clearIntro();
    this.clearMaker();
    this.clearStateCycler();
    this.stateCycler = new StateCyclerPanel({
      root: this.root,
      assets: this.assets,
      audio: this.audio,
      onBack: () => {
        this.audio.play("menuSelect");
        this.renderTitle();
      }
    });
    this.stateCycler.start();
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-cycler-animation], [data-cycler-action]");
  }

  renderIntro() {
    this.clearDialogue();
    this.clearEngine();
    this.clearIntro();
    this.clearMaker();
    this.clearStateCycler();
    this.intro = new IntroSequence({
      root: this.root,
      slides: introSlides,
      onComplete: () => {
        this.intro = null;
        this.renderTitle();
      }
    });
    this.intro.start();
    this.mountFullscreenButton();
  }

  bindTitleStart() {
    const screen = this.root.querySelector(".title-screen");
    const pressStart = this.root.querySelector("[data-action='press-start']");
    let started = false;
    const start = (event) => {
      if (started) return;
      if (event?.type === "keydown" && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
      started = true;
      screen.classList.add("has-started");
      this.ensureAudioStarted().then(() => this.audio.playStartCue());
      this.focusFirstMenuButton("[data-action='start']");
      window.removeEventListener("keydown", start);
    };
    pressStart.addEventListener("click", start);
    window.addEventListener("keydown", start);
  }

  async ensureAudioStarted() {
    await this.audio.unlock();
    await this.audio.startMusic();
  }

  renderActs() {
    this.clearDialogue();
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    const cards = acts
      .map((act) => {
        const location = locations[act.locationId];
        const locked = act.status !== "playable";
        return `
          <button class="act-card ${locked ? "is-locked" : ""}" data-act="${act.id}" ${locked ? "disabled" : ""}>
            <p class="eyebrow">${act.status === "playable" ? "Playable" : "Future module"}</p>
            <h3>${act.title}</h3>
            <p>${act.subtitle}</p>
            <p class="meta">${location?.name || "Unassigned location"}</p>
          </button>
        `;
      })
      .join("");
    this.root.innerHTML = `
      <section class="screen">
        <article class="act-shell">
          <div>
            <p class="eyebrow">Bible-like structure</p>
            <h2>Acts and playable phases</h2>
          </div>
          <div class="act-grid">${cards}</div>
          <div class="action-row">
            <button data-action="back">Back</button>
          </div>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-act], [data-action='back']");
    this.root.querySelector("[data-action='back']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderTitle();
    });
    for (const button of this.root.querySelectorAll("[data-act]")) {
      button.addEventListener("click", () => {
        const act = acts.find((item) => item.id === button.dataset.act);
        if (!act || act.status !== "playable") return;
        this.selectedAct = act;
        this.selectedScene = act.scenes[0];
        this.audio.play("menuSelect");
        this.renderStory("pre");
      });
    }
  }

  renderBackgroundTests() {
    this.clearDialogue();
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    const cards = backgroundTests
      .map(
        (test) => `
          <button class="background-card" data-background="${test.id}">
            <img src="${this.assets.record(test.id)?.src || ""}" alt="" aria-hidden="true" />
            <span>
              <strong>${test.title}</strong>
              <small>${test.subtitle}</small>
            </span>
          </button>
        `
      )
      .join("");
    this.root.innerHTML = `
      <section class="screen background-menu">
        <article class="act-shell wide">
          <div>
            <p class="eyebrow">Teste visual</p>
            <h2>Fundos jogaveis</h2>
            <p class="lead compact">Escolha uma tela para carregar a mesma arena de combate sobre outro fundo. E um menu rapido para avaliar contraste, escala e atmosfera.</p>
          </div>
          <div class="background-grid">${cards}</div>
          <div class="action-row">
            <button data-action="back">Voltar</button>
          </div>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-background], [data-action='back']");
    this.root.querySelector("[data-action='back']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderTitle();
    });
    for (const button of this.root.querySelectorAll("[data-background]")) {
      button.addEventListener("click", () => {
        const test = backgroundTests.find((item) => item.id === button.dataset.background);
        if (!test) return;
        this.selectedAct = acts[0];
        this.selectedScene = this.createBackgroundTestScene(test);
        this.audio.play("menuSelect");
        this.renderStory("pre");
      });
    }
  }

  createBackgroundTestScene(test) {
    const base = acts[0].scenes[0];
    return {
      ...base,
      id: `${base.id}-${test.id}`,
      title: test.title,
      locationId: test.locationId,
      objective: test.objective,
      backgroundId: test.id,
      backgroundMode: "plate",
      props: [],
      playerSpawn: { x: 260, lane: 0.6 },
      bounds: { ...base.bounds, left: 70, right: 1680 },
      testLoadingText: test.loadingText
    };
  }

  createDemoScene() {
    const base = acts[0].scenes[0];
    return {
      ...base,
      id: "demo-margin-riverbank",
      title: "Demo - Margem do Rio",
      backgroundId: "marginOfSentence",
      backgroundMode: "plate",
      objective: "Demo: sobreviva ao capataz e quebre a primeira linha de perseguicao.",
      bounds: { ...base.bounds, left: 70, right: 2300 },
      playerSpawn: { x: 300, lane: 0.62 }
    };
  }

  renderConfrontationIntro() {
    this.clearEngine();
    this.clearIntro();
    this.clearMaker();
    this.clearStateCycler();
    this.clearDialogue();
    this.dialogue = confrontationDialogues.act1Captain;
    this.dialogueIndex = 0;
    this.dialoguePreviousGamepadPressed = false;
    this.root.innerHTML = `
      <section class="screen dialogue-screen">
        <img class="dialogue-bg" src="${this.assets.record(this.dialogue.backgroundId)?.src || ""}" alt="" />
        <div class="dialogue-shade" aria-hidden="true"></div>
        <article class="dialogue-stage" aria-label="Intro de confronto">
          <div class="dialogue-character dialogue-character-left" data-dialogue-character="silva">
            ${this.renderDialogueSprite(this.dialogue.speakers.silva)}
          </div>
          <div class="dialogue-character dialogue-character-right" data-dialogue-character="captain">
            ${this.renderDialogueSprite(this.dialogue.speakers.captain)}
          </div>
          <div class="dialogue-card" data-dialogue-card>
            <p class="eyebrow">${this.dialogue.title}</p>
            <h2>${this.dialogue.subtitle}</h2>
            <div class="dialogue-bubble" data-dialogue-bubble>
              <strong data-dialogue-name></strong>
              <p data-dialogue-text></p>
            </div>
            <div class="dialogue-actions">
              <button class="primary" data-action="dialogue-next">Avancar</button>
              <button data-action="dialogue-skip">Ir para a luta</button>
              <button data-action="title">Menu</button>
            </div>
            <p class="meta">Enter, clique, A no controle ou timer avancam o dialogo.</p>
          </div>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.bindDialogue();
    this.showDialogueLine(0);
    this.focusFirstMenuButton("[data-action='dialogue-next']");
  }

  renderDialogueSprite(speaker) {
    const record = this.assets.record(speaker.spriteAssetId);
    const sheet = record?.sheet;
    if (!record?.src || !sheet) return "";
    const animation = sheet.animations[speaker.spriteState] || sheet.animations.idle;
    const frame = animation?.frames?.[0] || 0;
    const x = frame * sheet.frameWidth + (sheet.sourceInset || 0);
    const y = (animation?.row || 0) * sheet.frameHeight + (sheet.sourceInset || 0);
    const w = sheet.frameWidth - (sheet.sourceInset || 0) * 2;
    const h = sheet.frameHeight - (sheet.sourceInset || 0) * 2;
    const viewBox = `${x} ${y} ${w} ${h}`;
    return `
      <svg viewBox="${viewBox}" aria-hidden="true">
        <image href="${record.src}" width="${sheet.frameWidth * sheet.columns}" height="${sheet.frameHeight * sheet.rows}" />
      </svg>
    `;
  }

  bindDialogue() {
    const next = () => this.advanceDialogue();
    const skip = () => this.startDemoCombat();
    const title = () => {
      this.audio.play("menuSelect");
      this.renderTitle();
    };
    const keydown = (event) => {
      if (["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
      if (event.target.closest?.("button") && ["Enter", " "].includes(event.key)) return;
      if (event.key === "Escape") {
        skip();
        return;
      }
      next();
    };
    const pointer = (event) => {
      if (event.target.closest?.("button, [data-action='fullscreen']")) return;
      next();
    };
    const pollGamepad = () => {
      if (!this.dialogue) return;
      const pads = navigator.getGamepads?.() || [];
      const pressed = Array.from(pads).some((pad) => pad?.connected && pad.buttons.some((button) => button.pressed));
      if (pressed && !this.dialoguePreviousGamepadPressed) next();
      this.dialoguePreviousGamepadPressed = pressed;
      this.dialogueGamepadRaf = requestAnimationFrame(pollGamepad);
    };
    this.root.querySelector("[data-action='dialogue-next']").addEventListener("click", next);
    this.root.querySelector("[data-action='dialogue-skip']").addEventListener("click", skip);
    this.root.querySelector("[data-action='title']").addEventListener("click", title);
    window.addEventListener("keydown", keydown);
    window.addEventListener("pointerdown", pointer);
    this.dialogueGamepadRaf = requestAnimationFrame(pollGamepad);
    this.dialogueCleanup = () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("pointerdown", pointer);
      cancelAnimationFrame(this.dialogueGamepadRaf);
    };
  }

  showDialogueLine(index) {
    if (!this.dialogue) return;
    const line = this.dialogue.lines[index];
    if (!line) {
      this.startDemoCombat();
      return;
    }
    this.dialogueIndex = index;
    const speaker = this.dialogue.speakers[line.speaker];
    const card = this.root.querySelector("[data-dialogue-card]");
    const bubble = this.root.querySelector("[data-dialogue-bubble]");
    const name = this.root.querySelector("[data-dialogue-name]");
    const text = this.root.querySelector("[data-dialogue-text]");
    const screen = this.root.querySelector(".dialogue-screen");
    screen.dataset.speaker = speaker.side;
    bubble.classList.remove("is-line-in");
    card.classList.remove("is-line-in");
    this.root.querySelectorAll("[data-dialogue-character]").forEach((item) => {
      item.classList.toggle("is-speaking", item.dataset.dialogueCharacter === line.speaker);
    });
    name.textContent = speaker.name;
    text.textContent = line.text;
    requestAnimationFrame(() => {
      bubble.classList.add("is-line-in");
      card.classList.add("is-line-in");
    });
    clearTimeout(this.dialogueTimer);
    this.dialogueTimer = setTimeout(() => this.advanceDialogue(), this.dialogue.autoAdvanceMs);
  }

  advanceDialogue() {
    if (!this.dialogue) return;
    this.audio.play("menuMove", 0.5);
    this.showDialogueLine(this.dialogueIndex + 1);
  }

  startDemoCombat() {
    clearTimeout(this.dialogueTimer);
    this.dialogueTimer = 0;
    this.ensureAudioStarted()
      .catch(() => {})
      .then(() => {
        this.audio.play("combatStart");
        this.clearDialogue();
        this.renderGame();
      });
  }

  renderStory(position) {
    this.clearDialogue();
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    const act = this.selectedAct;
    const scene = this.selectedScene;
    const location = locations[scene.locationId];
    const text = position === "post" ? act.postCard : act.card;
    const heading = position === "post" ? "The machine can bleed" : scene.title;
    const buttonText = position === "post" ? "Return to Acts" : "Enter Combat";
    const loadingText = scene.testLoadingText || location.loadingText;
    this.root.innerHTML = `
      <section class="screen">
        <article class="story-card">
          <p class="eyebrow">${act.title} | ${location.name}</p>
          <h2>${heading}</h2>
          <p>${text}</p>
          <p class="meta">${loadingText}</p>
          <div class="action-row">
            <button class="primary" data-action="continue">${buttonText}</button>
            <button data-action="backgrounds">Testar Fundos</button>
            <button data-action="acts">Act Structure</button>
          </div>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.focusFirstMenuButton("[data-action='continue']");
    this.root.querySelector("[data-action='continue']").addEventListener("click", () => {
      this.audio.play(position === "post" ? "menuSelect" : "combatStart");
      if (position === "post") this.renderActs();
      else this.renderConfrontationIntro();
    });
    this.root.querySelector("[data-action='acts']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderActs();
    });
    this.root.querySelector("[data-action='backgrounds']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderBackgroundTests();
    });
  }

  renderGame() {
    this.clearDialogue();
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    this.root.innerHTML = `
      <section class="game-shell">
        <canvas aria-label="Playable combat canvas"></canvas>
        <div class="hud">
          <div class="hud-panel">
            <div class="label-row"><span>Body</span><span>Silva</span></div>
            <div class="bar body" data-body><span></span></div>
            <div class="label-row"><span>Cohesion</span><span data-phase>${this.selectedScene.title}</span></div>
            <div class="bar cohesion" data-cohesion><span></span></div>
            <div class="status-row">
              <span data-combo>Combo x0</span>
              <span data-cooldown>Pulse ready</span>
            </div>
          </div>
          <div class="control-panel">
            <strong>Controls</strong><br />
            Keyboard: A/D move, W/S depth, Shift run, J light chain, Shift+J rush, S+K launcher, Space+J air cut, K finisher, I special, E contain, L dodge/cancel, Q pulse. Gamepad: left stick/D-pad move, X light, Y heavy, LT special, B dodge, A jump, LB pulse, RB contain.
          </div>
        </div>
        <div class="toast">${this.selectedScene.objective}</div>
        <div class="pause-overlay hidden" data-pause>
          <div>
            <p class="eyebrow">Paused</p>
            <h2>Margin held</h2>
            <p>Esc resumes. R restarts the combat slice.</p>
          </div>
        </div>
      </section>
    `;
    this.mountFullscreenButton();
    const canvas = this.root.querySelector("canvas");
    const hud = this.root.querySelector(".hud");
    this.engine = new GameEngine({
      canvas,
      hud,
      scene: this.selectedScene,
      assets: this.assets,
      audio: this.audio,
      onStateChange: (state) => this.handleGameState(state)
    });
    this.engine.start();
    setTimeout(() => this.root.querySelector(".toast")?.classList.add("hidden"), 5600);
  }

  handleGameState(state) {
    if (state === "restart") {
      this.renderGame();
      return;
    }
    if (state === "victory") {
      this.renderResult("victory");
      return;
    }
    if (state === "defeat") this.renderResult("defeat");
  }

  renderResult(result) {
    this.clearEngine();
    this.clearMaker();
    this.clearStateCycler();
    const victory = result === "victory";
    this.root.innerHTML = `
      <section class="screen">
        <article class="result-card">
          <p class="eyebrow">${victory ? "Prototype loop complete" : "Prototype loop failed"}</p>
          <h2>${victory ? "He survives the margin" : "The body breaks first"}</h2>
          <p>${victory ? this.selectedAct.postCard : "The scene returns to the riverbank. This slice is tuned to be readable, not forgiving."}</p>
          <div class="action-row">
            <button class="primary" data-action="${victory ? "story" : "retry"}">${victory ? "Post Scene Card" : "Retry Combat"}</button>
            <button data-action="backgrounds">Testar Fundos</button>
            <button data-action="acts">Act Structure</button>
            <button data-action="title">Title</button>
          </div>
        </article>
      </section>
    `;
    this.mountFullscreenButton();
    this.focusFirstMenuButton(".primary");
    this.root.querySelector("[data-action='acts']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderActs();
    });
    this.root.querySelector("[data-action='title']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderTitle();
    });
    this.root.querySelector("[data-action='backgrounds']").addEventListener("click", () => {
      this.audio.play("menuSelect");
      this.renderBackgroundTests();
    });
    this.root.querySelector(".primary").addEventListener("click", () => {
      this.audio.play("menuSelect");
      if (victory) this.renderStory("post");
      else this.renderGame();
    });
  }
}
