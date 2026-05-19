const CONFIG = {
  frame: {
    columns: 7,
    rows: 4,
    totalFrames: 28,
    cleanCheckerboard: true,
  },
  palette: {
    black: "#080716",
    magenta: "#ff2a9d",
    cyan: "#00f0ff",
    yellow: "#f6ff3b",
    green: "#2cff8f",
    white: "#f5f1ff",
  },
  phases: {
    filhote: {
      label: "FILHOTE",
      folder: "assets/sprites_aligned/filhote",
      sprites: {
        idle: "kitty_idle_7x4.png",
        walk: "kitty_walk_6x4.png",
        run: "kitty_run_7x4.png",
        jump: "Kitty_jump_7x4.png",
        attack: "kitty_attack_7x4.png",
        down: "kitty_down_7x4.png",
        getting_up: "kitty_getUp_7x4.png",
        licking_fur: "kitty_lick_7x4.png",
      },
      scale: 0.92,
      speed: 0.95,
      runSpeed: 1.08,
      jumpHeight: 1.08,
      glow: "#00f0ff",
      voice: "#00f0ff",
      stage: 0,
    },
    adulto: {
      label: "ADULTO",
      folder: "assets/sprites_aligned/adulto",
      sprites: {
        idle: "adult_idle_6x4.png",
        walk: "adult_walk_6x4.png",
        run: "adult_run_6x4.png",
        jump: "adult_jump_6x4.png",
        attack: "adult_attack_6x4.png",
        down: "adult_down_6x4.png",
        getting_up: "adult_getting_up_6x4.png",
        licking_fur: "adult_licking_fur_6x4.png",
      },
      scale: 1.1,
      speed: 1.15,
      runSpeed: 1.28,
      jumpHeight: 1,
      glow: "#2cff8f",
      voice: "#2cff8f",
      stage: 4,
    },
    idoso: {
      label: "IDOSO",
      folder: "assets/sprites_aligned/idoso",
      sprites: {
        idle: "old_idle_6x4.png",
        walk: "old_walk_6x4.png",
        run: "old_run_6x4.png",
        jump: "old_jump_6x4.png",
        attack: "old_attack_6x4.png",
        down: "old_down_6x4.png",
        getting_up: "old_getting_up_6x4.png",
        licking_fur: "old_licking_fur_6x4.png",
      },
      scale: 1.02,
      speed: 0.68,
      runSpeed: 0.82,
      jumpHeight: 0.6,
      glow: "#f6ff3b",
      voice: "#f6ff3b",
      stage: 9,
    },
  },
  states: {
    idle: { file: "idle.png", fps: 8, loop: true },
    walk: { file: "walk.png", fps: 10, loop: true },
    run: { file: "run.png", fps: 14, loop: true },
    jump: { file: "jump.png", fps: 12, loop: false },
    attack: { file: "attack.png", fps: 14, loop: false },
    down: { file: "down.png", fps: 8, loop: false, holdLastFrame: true },
    getting_up: { file: "getting_up.png", fps: 10, loop: false },
    licking_fur: { file: "licking_fur.png", fps: 8, loop: true, duration: 3400 },
  },
  stages: Array.from({ length: 14 }, (_, index) => ({
    label: `Level ${String(index + 1).padStart(2, "0")}`,
    file: `assets/stages/stage_${String(index + 1).padStart(2, "0")}.png`,
  })),
  ui: {
    butterfly: "assets/ui/borboleta.png",
  },
  soundtracks: [
    {
      label: "Fase 3 - O Limiar (Take 1)",
      file: "assets/audio/soundtracks/Fase 3_ O Limiar (Take 1).mp3",
    },
    {
      label: "Fase 3 - O Limiar (Take 2)",
      file: "assets/audio/soundtracks/Fase 3_ O Limiar (Take 2).mp3",
    },
    {
      label: "Fase 4 - A Disparada (Take 1)",
      file: "assets/audio/soundtracks/Fase 4_ A Disparada (Take 1).mp3",
    },
    {
      label: "Fase 4 - A Disparada (Take 2)",
      file: "assets/audio/soundtracks/Fase 4_ A Disparada (Take 2).mp3",
    },
  ],
};

// Animatic Ato 1:
// 1. Coloque os sprites em assets/beats/beatXX/beatXX_YY.png.
// 2. Renomeie arquivos no array files de cada item em BEATS.
// 3. Ajuste FPS em defaultFps ou no slider da interface.
// 4. Ligue/desligue autoplaySequence pelo checkbox "Autoplay seq.".
// 5. Sons futuros entram em assets/audio/ e sao chamados por AUDIO_CUES.
const BEAT_FRAME = {
  columns: 8,
  rows: 4,
  totalFrames: 32,
  frameWidth: 256,
  frameHeight: 256,
};

function beatSheetFiles(beatNumber, count = 8) {
  return Array.from({ length: count }, (_, index) => `beat${String(beatNumber).padStart(2, "0")}_${String(index + 1).padStart(2, "0")}.png`);
}

const BEATS = [
  {
    id: "beat01",
    title: "O abrigo",
    subtitle: "Antes do mundo ser grande demais.",
    emotionalFunction: "Segurança, fragilidade e primeiro impulso de curiosidade.",
    gameplayMeaning: "Botão Corpo mexe, engatinha e tenta levantar. Botão Voz mia baixo e chama a mãe.",
    soundDirection: "Respiração da mãe, miados suaves, tecido, caixa, ruído distante da rua.",
    textBox:
      "O filhote ainda está perto da mãe. O som é abafado, quente, quase seguro. Cada pequeno movimento é uma descoberta: levantar a cabeça, mexer as orelhas, sentir a luz. O botão ainda não significa fuga. Significa existir.",
    assetFolder: "assets/beats_aligned/beat01",
    files: beatSheetFiles(1),
    defaultFps: 10,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat02",
    title: "Primeiros passos",
    subtitle: "O primeiro rompimento.",
    emotionalFunction: "Curiosidade misturada com ansiedade.",
    gameplayMeaning: "Botão Corpo anda e tropeça. Botão Voz chama a mãe ou hesita.",
    soundDirection: "Passinhos leves, miado curto, ambiente abrindo, chamado distante da mãe.",
    textBox:
      "Ele começa a se afastar. Ainda tropeça, ainda olha para trás, ainda espera que a mãe esteja ali. Mas a curiosidade empurra mais forte que o medo. A cada passo, o abrigo fica menor.",
    assetFolder: "assets/beats_aligned/beat02",
    files: beatSheetFiles(2),
    defaultFps: 10,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat03",
    title: "O limiar",
    subtitle: "A linha entre colo e mundo.",
    emotionalFunction: "Medo e maravilhamento.",
    gameplayMeaning: "Botão Corpo avança. Botão Voz chama, hesita ou pede segurança.",
    soundDirection: "Vento, rua entrando, grave baixo de tensão, mudança de ambiência.",
    textBox:
      "Na saída do abrigo, a luz bate forte. O mundo entra de uma vez: vento, ruído, cheiro de rua. O filhote recua por um instante. Depois decide. Um passo para fora não parece muito, mas é a primeira grande travessia da vida.",
    assetFolder: "assets/beats_aligned/beat03",
    files: beatSheetFiles(3),
    defaultFps: 10,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat04",
    title: "O susto",
    subtitle: "A curiosidade vira sobrevivência.",
    emotionalFunction: "Ruptura, pânico e instinto.",
    gameplayMeaning: "Botão Corpo corre e esquiva. Botão Voz solta miados de pânico e ajuda a controlar o medo.",
    soundDirection: "Latido, estalo brusco, respiração curta, coração acelerando, patas raspando.",
    textBox:
      "Um barulho corta tudo. O corpo encolhe antes de entender. O coração dispara. O filhote salta, gira e corre. A brincadeira acabou. Agora o botão não é mais descoberta. É fuga.",
    assetFolder: "assets/beats_aligned/beat04",
    files: beatSheetFiles(4),
    defaultFps: 12,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat05",
    title: "A rua",
    subtitle: "O mundo grande demais.",
    emotionalFunction: "Trauma, confusão e vulnerabilidade.",
    gameplayMeaning: "Botão Corpo tenta levantar e se equilibrar. Botão Voz respira, mia e tenta estabilizar o coração.",
    soundDirection: "Freada, buzina, pancada abafada, coração no HUD, respiração ofegante.",
    textBox:
      "A corrida quebra. Luzes passam rápido demais. Um freio, uma buzina, um impacto que talvez tenha sido quase, talvez tenha sido real. O filhote derrapa, perde o eixo e cai. Ele tenta levantar, mas o mundo gira.",
    assetFolder: "assets/beats_aligned/beat05",
    files: beatSheetFiles(5),
    defaultFps: 11,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat06",
    title: "A chuva",
    subtitle: "A rua vira rio.",
    emotionalFunction: "Impotência e sobrevivência física.",
    gameplayMeaning: "Botão Corpo tenta firmar as patas e nadar. Botão Voz mia por ajuda e marca a respiração.",
    soundDirection: "Chuva forte, água correndo, sarjeta, miados aflitos.",
    textBox:
      "A água chega primeiro como poça. Depois como força. As patas escorregam. O corpo tenta resistir, mas a correnteza puxa. O filhote ainda luta, mas já não escolhe a direção.",
    assetFolder: "assets/beats_aligned/beat06",
    files: beatSheetFiles(6),
    defaultFps: 11,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat07",
    title: "O bueiro",
    subtitle: "Quase sumir.",
    emotionalFunction: "Ponto mais escuro da sequência; quase morte.",
    gameplayMeaning: "Botão Corpo nada desesperadamente. Botão Voz tenta respirar, miar e manter consciência.",
    soundDirection: "Correnteza forte, eco metálico do bueiro, respiração cortada, água engolindo, tensão máxima.",
    textBox:
      "A correnteza gira. A cabeça entra e sai da água. O ar falta. O bueiro aparece como uma boca escura, puxando tudo. O filhote bate as patas sem ritmo, sem força, só insistindo em não desaparecer.",
    assetFolder: "assets/beats_aligned/beat07",
    files: beatSheetFiles(7),
    defaultFps: 12,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
  {
    id: "beat08",
    title: "O resgate",
    subtitle: "Ainda vivo.",
    emotionalFunction: "Liberação, alívio e sobrevivência.",
    gameplayMeaning: "Botão Corpo dá o último impulso. Botão Voz chama, respira e confirma que ainda há vida.",
    soundDirection: "Roda de bicicleta, splash, ruído metálico, tecido ou mão resgatando, respiração aliviada, música abrindo.",
    textBox:
      "Algo muda no fluxo. Uma roda, uma luz, uma intervenção. O filhote reage com o pouco que resta. Um último impulso, um splash diferente, e a água deixa de vencer. Ele termina encharcado, exausto, tremendo — mas vivo.",
    assetFolder: "assets/beats_aligned/beat08",
    files: beatSheetFiles(8),
    defaultFps: 10,
    frameCount: 32,
    nextBeatBehavior: "pause_or_autoplay",
  },
];

const AUDIO_CUES = {
  beat01: ["mother_purr", "soft_meow", "distant_street"],
  beat02: ["tiny_steps", "short_meow", "mother_call"],
  beat03: ["wind", "street_rumble", "tension_low"],
  beat04: ["dog_bark", "heartbeat_fast", "scratches"],
  beat05: ["car_brake", "horn", "muffled_hit", "heartbeat"],
  beat06: ["heavy_rain", "gutter_water", "distress_meow"],
  beat07: ["storm_current", "metal_drain_echo", "gasp"],
  beat08: ["bike_wheel", "rescue_splash", "relief_breath", "music_open"],
};

const PHASES = Object.keys(CONFIG.phases);
const STATES = Object.keys(CONFIG.states);
const LEVEL_WIDTH = 2508;
const PHASE_LEVEL_RANGES = [
  { phase: "filhote", start: 0, end: 3 },
  { phase: "adulto", start: 4, end: 8 },
  { phase: "idoso", start: 9, end: 13 },
];
const TOTAL_WORLD_WIDTH = LEVEL_WIDTH * CONFIG.stages.length;
const HAPTIC_EFFECTS = {
  jump: {
    label: "Pulo",
    mobilePattern: [35, 190, 55],
    rumble: [
      { delay: 0, duration: 55, weak: 0.18, strong: 0.38 },
      { delay: 245, duration: 70, weak: 0.28, strong: 0.5 },
    ],
  },
  purr: {
    label: "Ronronar",
    mobilePattern: [28, 42, 28, 42, 36, 48, 36, 48, 28, 42, 28],
    rumble: [
      { delay: 0, duration: 80, weak: 0.18, strong: 0.04 },
      { delay: 120, duration: 90, weak: 0.24, strong: 0.05 },
      { delay: 250, duration: 95, weak: 0.2, strong: 0.04 },
      { delay: 390, duration: 110, weak: 0.26, strong: 0.06 },
      { delay: 540, duration: 90, weak: 0.2, strong: 0.04 },
      { delay: 670, duration: 80, weak: 0.16, strong: 0.03 },
    ],
  },
  voice: {
    label: "Miado",
    mobilePattern: [45, 35, 80],
    rumble: [
      { delay: 0, duration: 65, weak: 0.2, strong: 0.14 },
      { delay: 95, duration: 120, weak: 0.35, strong: 0.2 },
    ],
  },
  attack: {
    label: "Ataque",
    mobilePattern: [24, 28, 42],
    rumble: [
      { delay: 0, duration: 42, weak: 0.16, strong: 0.72 },
      { delay: 76, duration: 45, weak: 0.1, strong: 0.5 },
    ],
  },
  down: {
    label: "Queda",
    mobilePattern: [90],
    rumble: [{ delay: 0, duration: 115, weak: 0.42, strong: 0.85 }],
  },
  up: {
    label: "Levantar",
    mobilePattern: [30, 35, 60],
    rumble: [
      { delay: 0, duration: 50, weak: 0.12, strong: 0.12 },
      { delay: 80, duration: 75, weak: 0.24, strong: 0.28 },
      { delay: 180, duration: 90, weak: 0.32, strong: 0.4 },
    ],
  },
  care: {
    label: "Cuidar",
    mobilePattern: [26, 44, 26, 44, 54],
    rumble: [
      { delay: 0, duration: 60, weak: 0.2, strong: 0.05 },
      { delay: 115, duration: 60, weak: 0.23, strong: 0.05 },
      { delay: 230, duration: 100, weak: 0.3, strong: 0.08 },
    ],
  },
  phase: {
    label: "Fase",
    mobilePattern: [35, 45, 35],
    rumble: [
      { delay: 0, duration: 55, weak: 0.16, strong: 0.28 },
      { delay: 105, duration: 55, weak: 0.28, strong: 0.16 },
    ],
  },
};

const gameShell = document.getElementById("gameShell");
const gameFrame = document.getElementById("gameFrame");
const hud = document.querySelector(".hud");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const warningPanel = document.getElementById("warningPanel");
const stateLabel = document.getElementById("stateLabel");
const phaseLabel = document.getElementById("phaseLabel");
const levelLabel = document.getElementById("levelLabel");
const levelProgress = document.getElementById("levelProgress");
const gamepadLabel = document.getElementById("gamepadLabel");
const openCinematicButton = document.getElementById("openCinematicButton");
const frameCheckerButton = document.getElementById("frameCheckerButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const gameUiToggle = document.getElementById("gameUiToggle");
const hapticsToggle = document.getElementById("hapticsToggle");
const hapticsPanel = document.getElementById("hapticsPanel");
const hapticsClose = document.getElementById("hapticsClose");
const hapticsStatus = document.getElementById("hapticsStatus");
const hapticsStrength = document.getElementById("hapticsStrength");
const hapticsStrengthValue = document.getElementById("hapticsStrengthValue");
const debugState = document.getElementById("debugState");
const debugPhase = document.getElementById("debugPhase");
const stageSelect = document.getElementById("stageSelect");
const soundtrackSelect = document.getElementById("soundtrackSelect");
const fpsSlider = document.getElementById("fpsSlider");
const fpsValue = document.getElementById("fpsValue");
const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");
const gridCheck = document.getElementById("gridCheck");
const pauseCheck = document.getElementById("pauseCheck");
const nextFrameButton = document.getElementById("nextFrame");
const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystickKnob");
const cinematicIntroElement = document.getElementById("cinematicIntro");
const beatCanvas = document.getElementById("beatCanvas");
const beatTextBox = document.getElementById("beatTextBox");
const beatCounter = document.getElementById("beatCounter");
const beatTitle = document.getElementById("beatTitle");
const beatSubtitle = document.getElementById("beatSubtitle");
const beatCopy = document.getElementById("beatCopy");
const beatPlayState = document.getElementById("beatPlayState");
const beatTechPanel = document.getElementById("beatTechPanel");
const beatOptionsPanel = document.getElementById("beatOptionsPanel");
const beatIndexLabel = document.getElementById("beatIndexLabel");
const sheetIndexLabel = document.getElementById("sheetIndexLabel");
const frameIndexLabel = document.getElementById("frameIndexLabel");
const beatFpsLabel = document.getElementById("beatFpsLabel");
const beatDurationLabel = document.getElementById("beatDurationLabel");
const beatTotalFramesLabel = document.getElementById("beatTotalFramesLabel");
const sequenceTotalFramesLabel = document.getElementById("sequenceTotalFramesLabel");
const beatWarnings = document.getElementById("beatWarnings");
const beatTimeline = document.getElementById("beatTimeline");
const beatSequenceSelect = document.getElementById("beatSequenceSelect");
const beatSequenceList = document.getElementById("beatSequenceList");
const beatFpsSlider = document.getElementById("beatFpsSlider");
const beatScaleSlider = document.getElementById("beatScaleSlider");
const beatBackgroundMode = document.getElementById("beatBackgroundMode");
const beatSoundtrackSelect = document.getElementById("beatSoundtrackSelect");
const beatAutoplayToggle = document.getElementById("beatAutoplayToggle");
const beatBoundsToggle = document.getElementById("beatBoundsToggle");
const beatGridToggle = document.getElementById("beatGridToggle");
const beatRainToggle = document.getElementById("beatRainToggle");
const beatTextToggle = document.getElementById("beatTextToggle");
const beatDebugToggle = document.getElementById("beatDebugToggle");
const closeCinematicButton = document.getElementById("closeCinematic");
const cinematicBodyButton = document.getElementById("cinematicBodyButton");
const cinematicVoiceButton = document.getElementById("cinematicVoiceButton");
const frameCheckerElement = document.getElementById("frameChecker");
const frameCheckerCanvas = document.getElementById("frameCheckerCanvas");
const frameCheckerClose = document.getElementById("frameCheckerClose");
const checkerSource = document.getElementById("checkerSource");
const checkerGameplayControls = document.getElementById("checkerGameplayControls");
const checkerBeatControls = document.getElementById("checkerBeatControls");
const checkerPhase = document.getElementById("checkerPhase");
const checkerState = document.getElementById("checkerState");
const checkerBeat = document.getElementById("checkerBeat");
const checkerSheet = document.getElementById("checkerSheet");
const checkerFrame = document.getElementById("checkerFrame");
const checkerFrameLabel = document.getElementById("checkerFrameLabel");
const checkerPrevFrame = document.getElementById("checkerPrevFrame");
const checkerNextFrame = document.getElementById("checkerNextFrame");
const checkerScale = document.getElementById("checkerScale");
const checkerScaleLabel = document.getElementById("checkerScaleLabel");
const checkerPrevAlpha = document.getElementById("checkerPrevAlpha");
const checkerPrevAlphaLabel = document.getElementById("checkerPrevAlphaLabel");
const checkerNextAlpha = document.getElementById("checkerNextAlpha");
const checkerNextAlphaLabel = document.getElementById("checkerNextAlphaLabel");
const checkerPrevToggle = document.getElementById("checkerPrevToggle");
const checkerNextToggle = document.getElementById("checkerNextToggle");
const checkerMaskToggle = document.getElementById("checkerMaskToggle");
const checkerGridToggle = document.getElementById("checkerGridToggle");
const checkerBoundsToggle = document.getElementById("checkerBoundsToggle");
const checkerInfo = document.getElementById("checkerInfo");

let width = 0;
let height = 0;
let dpr = 1;
let lastTime = 0;
let assetsReady = false;
let currentPhase = "filhote";
let currentState = "idle";
let currentStage = 0;
let manualDebug = false;
let facing = 1;
let worldX = 720;
let catY = 0;
let bodyHoldTimer = null;
let bodyHeld = false;
let touchRun = false;
let voicePulse = 0;
let cameraX = 0;
let gamepadAxisX = 0;
let gamepadRun = false;
let activeGamepadIndex = null;
let audioContext = null;
let masterGain = null;
let lastHapticStatus = "";
let cinematicIntro = null;
let frameChecker = null;
let gameUiVisible = true;
let currentSoundtrackAudio = null;

const pressed = new Set();
const warnings = [];
const animators = {};
const stageImages = [];
const particles = [];
const rain = [];
const previousGamepadButtons = new Map();
const joystickState = {
  active: false,
  id: null,
  x: 0,
  y: 0,
};

class SpriteAnimator {
  constructor({ image, columns, rows, totalFrames, fps, loop, holdLastFrame = false, phase = "filhote", state = "idle" }) {
    this.image = image;
    this.columns = columns;
    this.rows = rows;
    this.totalFrames = totalFrames;
    this.fps = fps;
    this.loop = loop;
    this.holdLastFrame = holdLastFrame;
    this.phase = phase;
    this.state = state;
    this.anchorMode = "frame";
    this.currentFrame = 0;
    this.elapsed = 0;
    this.finished = false;
    this.frameWidth = image ? image.width / columns : 256;
    this.frameHeight = image ? image.height / rows : 256;
    this.frameRects = image ? this.buildFrameRects() : [];
    this.frameAnchors = [];
    this.frameBoxes = image ? this.buildFrameBoxes() : [];
    this.anchor = image ? this.buildStableAnchor() : { x: this.frameWidth / 2, y: this.frameHeight };
  }

  reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
    this.finished = false;
  }

  setFps(fps) {
    this.fps = Math.max(1, Number(fps) || this.fps);
  }

  update(deltaTime) {
    if (pauseCheck.checked || this.finished) return;

    this.elapsed += deltaTime;
    const frameTime = 1 / this.fps;

    while (this.elapsed >= frameTime) {
      this.elapsed -= frameTime;
      this.currentFrame += 1;

      if (this.currentFrame >= this.totalFrames) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.holdLastFrame ? this.totalFrames - 1 : this.totalFrames - 1;
          this.finished = true;
          break;
        }
      }
    }
  }

  nextFrame() {
    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    this.finished = false;
  }

  buildFrameRects() {
    const rects = [];

    for (let frame = 0; frame < this.totalFrames; frame += 1) {
      const col = frame % this.columns;
      const row = Math.floor(frame / this.columns);
      const x0 = Math.round((this.image.width * col) / this.columns);
      const x1 = Math.round((this.image.width * (col + 1)) / this.columns);
      const y0 = Math.round((this.image.height * row) / this.rows);
      const y1 = Math.round((this.image.height * (row + 1)) / this.rows);
      rects.push({
        x: x0,
        y: y0,
        w: Math.max(1, x1 - x0),
        h: Math.max(1, y1 - y0),
      });
    }

    return rects;
  }

  buildFrameBoxes() {
    const source = document.createElement("canvas");
    source.width = this.image.width;
    source.height = this.image.height;
    const sourceCtx = source.getContext("2d", { willReadFrequently: true });
    sourceCtx.drawImage(this.image, 0, 0);
    const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
    const pixels = imageData.data;
    const boxes = [];

    for (let frame = 0; frame < this.totalFrames; frame += 1) {
      const rect = this.frameRects[frame];
      const startX = rect.x;
      const startY = rect.y;
      let minX = rect.w;
      let minY = rect.h;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < rect.h; y += 1) {
        const py = startY + y;
        for (let x = 0; x < rect.w; x += 1) {
          const px = startX + x;
          const alpha = pixels[(py * source.width + px) * 4 + 3];
          if (alpha <= 24) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (maxX < minX || maxY < minY) {
        boxes.push({
          x: 0,
          y: 0,
          w: rect.w,
          h: rect.h,
        });
        this.frameAnchors.push({ x: rect.w / 2, y: rect.h });
        continue;
      }

      const padding = 2;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(rect.w - 1, maxX + padding);
      maxY = Math.min(rect.h - 1, maxY + padding);

      boxes.push({
        x: minX,
        y: minY,
        w: maxX - minX + 1,
        h: maxY - minY + 1,
      });
      this.frameAnchors.push(this.calculateFrameAnchor(pixels, source.width, startX, startY, { minX, minY, maxX, maxY }));
    }

    return boxes;
  }

  calculateFrameAnchor(sourcePixels, sourceWidth, startX, startY, box) {
    const boxHeight = Math.max(1, box.maxY - box.minY + 1);
    const lowerLimit = box.minY + boxHeight * 0.66;
    const contactLimit = Math.max(box.minY, box.maxY - Math.max(4, Math.round(boxHeight * 0.18)));
    const contactXs = [];
    const lowerXs = [];
    const allYs = [];

    for (let y = box.minY; y <= box.maxY; y += 1) {
      const py = startY + y;
      for (let x = box.minX; x <= box.maxX; x += 1) {
        const px = startX + x;
        const alpha = sourcePixels[(py * sourceWidth + px) * 4 + 3];
        if (alpha <= 24) continue;
        allYs.push(y);
        if (y >= contactLimit) contactXs.push(x);
        if (y >= lowerLimit) lowerXs.push(x);
      }
    }

    contactXs.sort((a, b) => a - b);
    lowerXs.sort((a, b) => a - b);
    allYs.sort((a, b) => a - b);

    const anchorXs = contactXs.length >= 8 ? contactXs : lowerXs;

    return {
      x: anchorXs.length ? median(anchorXs) : (box.minX + box.maxX) / 2,
      y: percentile(allYs, 0.995),
    };
  }

  buildStableAnchor() {
    const xs = this.frameAnchors.map((anchor) => anchor.x).sort((a, b) => a - b);
    const ys = this.frameAnchors.map((anchor) => anchor.y).sort((a, b) => a - b);

    if (!xs.length || !ys.length) {
      return { x: this.frameWidth / 2, y: this.frameHeight };
    }

    return { x: median(xs), y: median(ys) };
  }

  draw(ctx, x, y, scale, flipX = false, showBounds = false, alpha = 1) {
    if (!this.image) {
      drawFallbackCat(ctx, x, y, scale, flipX);
      return;
    }

    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);
    const rect = this.frameRects[this.currentFrame] || {
      x: col * this.frameWidth,
      y: row * this.frameHeight,
      w: this.frameWidth,
      h: this.frameHeight,
    };
    const box = this.frameBoxes[this.currentFrame] || { x: 0, y: 0, w: rect.w, h: rect.h };
    const anchor = this.anchorMode === "stable" ? this.anchor : this.frameAnchors[this.currentFrame] || this.anchor;
    const sx = rect.x + box.x;
    const sy = rect.y + box.y;
    const sw = box.w;
    const sh = box.h;
    const dw = sw * scale;
    const dh = sh * scale;
    const sourceOriginX = x - anchor.x * scale;
    const sourceOriginY = y - anchor.y * scale;
    const dx = Math.round(sourceOriginX + box.x * scale);
    const flippedDx = Math.round(x + (anchor.x - box.x - box.w) * scale);
    const dy = Math.round(sourceOriginY + box.y * scale);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;

    if (flipX) {
      ctx.translate(flippedDx + dw, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, dw, dh);
      ctx.restore();
      if (showBounds) {
        drawBounds(ctx, x - anchor.x * scale, y - anchor.y * scale, rect.w * scale, rect.h * scale, "rgba(0, 240, 255, 0.75)");
        drawBounds(ctx, flippedDx, dy, dw, dh, CONFIG.palette.green);
        drawAnchorCross(ctx, x, y);
      }
      return;
    } else {
      ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);
      if (showBounds) {
        drawBounds(ctx, x - anchor.x * scale, y - anchor.y * scale, rect.w * scale, rect.h * scale, "rgba(0, 240, 255, 0.75)");
        drawBounds(ctx, dx, dy, dw, dh, CONFIG.palette.green);
        drawAnchorCross(ctx, x, y);
      }
    }

    ctx.restore();
  }
}

function drawBounds(ctx, x, y, w, h, color = CONFIG.palette.green) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.restore();
}

function drawAnchorCross(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = CONFIG.palette.yellow;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(Math.round(x - 8), Math.round(y));
  ctx.lineTo(Math.round(x + 8), Math.round(y));
  ctx.moveTo(Math.round(x), Math.round(y - 8));
  ctx.lineTo(Math.round(x), Math.round(y + 8));
  ctx.stroke();
  ctx.restore();
}

function median(values) {
  if (!values.length) return 0;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}

function percentile(values, amount) {
  if (!values.length) return 0;
  const index = clamp(Math.round((values.length - 1) * amount), 0, values.length - 1);
  return values[index];
}

function resizeCanvas() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = gameFrame.getBoundingClientRect();
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  catY = height - Math.max(64, height * 0.1);
  cameraX = clamp(cameraX, 0, Math.max(0, TOTAL_WORLD_WIDTH - width));
  seedRain();
}

function seedRain() {
  rain.length = 0;
  const count = Math.floor(Math.min(180, Math.max(60, width / 8)));
  for (let i = 0; i < count; i += 1) {
    rain.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 280 + Math.random() * 520,
      length: 10 + Math.random() * 20,
      color: Math.random() > 0.65 ? CONFIG.palette.magenta : CONFIG.palette.cyan,
    });
  }
}

async function loadAssets() {
  let loaded = 0;
  const spriteJobs = PHASES.length * STATES.length;
  const totalJobs = spriteJobs + CONFIG.stages.length + 1;

  for (const phase of PHASES) {
    animators[phase] = {};
    const folder = CONFIG.phases[phase].folder;

    for (const state of STATES) {
      const stateConfig = spriteStateConfig(phase, state);
      const image = await loadImage(`${folder}/${stateConfig.file}`, true);
      loaded += 1;
      loadingText.textContent = `Carregando assets... ${loaded}/${totalJobs}`;
      animators[phase][state] = new SpriteAnimator({
        image,
        columns: stateConfig.columns,
        rows: stateConfig.rows,
        totalFrames: stateConfig.totalFrames,
        fps: stateConfig.fps,
        loop: stateConfig.loop,
        holdLastFrame: stateConfig.holdLastFrame,
        phase,
        state,
      });
    }
  }

  for (const stage of CONFIG.stages) {
    stageImages.push(await loadImage(stage.file, false));
    loaded += 1;
    loadingText.textContent = `Carregando assets... ${loaded}/${totalJobs}`;
  }

  animators.butterfly = new SpriteAnimator({
    image: await loadImage(CONFIG.ui.butterfly, true),
    columns: CONFIG.frame.columns,
    rows: CONFIG.frame.rows,
    totalFrames: CONFIG.frame.totalFrames,
    fps: 12,
    loop: true,
  });

  updateWarnings();
  assetsReady = true;
  currentStage = 0;
  worldX = LEVEL_WIDTH * 0.35;
  cameraX = clamp(worldX - width * 0.5, 0, Math.max(0, TOTAL_WORLD_WIDTH - width));
  syncLevelFromWorld();
  setPhase("filhote", true);
  setState("idle", true);
  loading.classList.add("is-hidden");
}

function loadImage(file, clean) {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 3;

    const tryLoad = () => {
      attempts += 1;
      const image = new Image();
      image.onload = () => resolve(clean ? cleanCheckerboard(image, file) : image);
      image.onerror = () => {
        if (attempts < maxAttempts) {
          window.setTimeout(tryLoad, 90);
          return;
        }
        warnings.push(`Asset nao encontrado: ${file}. Fallback ativado.`);
        resolve(null);
      };
      image.src = file;
    };

    tryLoad();
  });
}

function cleanCheckerboard(image, file) {
  const offscreen = document.createElement("canvas");
  offscreen.width = image.naturalWidth;
  offscreen.height = image.naturalHeight;
  const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  offCtx.drawImage(image, 0, 0);

  try {
    const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const pixels = imageData.data;
    const hasTransparentCorners = [
      3,
      (offscreen.width - 1) * 4 + 3,
      ((offscreen.height - 1) * offscreen.width) * 4 + 3,
      ((offscreen.height - 1) * offscreen.width + offscreen.width - 1) * 4 + 3,
    ].every((offset) => pixels[offset] <= 12);

    if (hasTransparentCorners) return image;

    const cornerColors = sampleCornerColors(imageData, offscreen.width, offscreen.height);

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const neutral = max - min < 30;
      const checkerWhite = neutral && min > 214;
      const checkerGray = neutral && min > 178 && max < 238;
      const cornerMatch = cornerColors.some((color) => colorDistance(color, [r, g, b]) < 26);

      if (a < 12 || checkerWhite || checkerGray || cornerMatch) {
        pixels[i + 3] = 0;
      }
    }

    offCtx.putImageData(imageData, 0, 0);
    return offscreen;
  } catch (error) {
    warnings.push(`Não foi possível limpar checkerboard em ${file}.`);
    return image;
  }
}

function sampleCornerColors(imageData, imageWidth, imageHeight) {
  const pixels = imageData.data;
  const points = [
    [0, 0],
    [imageWidth - 1, 0],
    [0, imageHeight - 1],
    [imageWidth - 1, imageHeight - 1],
  ];

  return points
    .map(([x, y]) => {
      const offset = (y * imageWidth + x) * 4;
      return [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    })
    .filter(([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b) < 45);
}

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function updateWarnings() {
  if (!warnings.length) return;
  warningPanel.classList.add("has-warning");
  warningPanel.innerHTML = warnings.map((warning) => `<div>${escapeHtml(warning)}</div>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function phaseProfile() {
  return CONFIG.phases[currentPhase];
}

function spriteStateConfig(phase, state) {
  const phaseConfig = CONFIG.phases[phase];
  const stateConfig = CONFIG.states[state];
  const file = phaseConfig.sprites?.[state] || stateConfig.file;
  const grid = parseSpriteGrid(file);

  return {
    ...stateConfig,
    file,
    columns: grid.columns,
    rows: grid.rows,
    totalFrames: grid.columns * grid.rows,
  };
}

function parseSpriteGrid(file) {
  const match = String(file).match(/(\d+)x(\d+)/i);
  if (!match) {
    return {
      columns: CONFIG.frame.columns,
      rows: CONFIG.frame.rows,
    };
  }

  return {
    columns: Math.max(1, Number(match[1]) || CONFIG.frame.columns),
    rows: Math.max(1, Number(match[2]) || CONFIG.frame.rows),
  };
}

function activeAnimator() {
  return animators[currentPhase]?.[currentState];
}

function baseScale() {
  return Number(scaleSlider.value) * phaseProfile().scale;
}

function phaseForLevel(levelIndex) {
  const range = PHASE_LEVEL_RANGES.find((item) => levelIndex >= item.start && levelIndex <= item.end);
  return range ? range.phase : "filhote";
}

function syncLevelFromWorld(playSound = false) {
  const levelIndex = clamp(Math.floor(worldX / LEVEL_WIDTH), 0, CONFIG.stages.length - 1);
  const nextPhase = phaseForLevel(levelIndex);
  const changedLevel = levelIndex !== currentStage;
  const changedPhase = nextPhase !== currentPhase;

  currentStage = levelIndex;
  stageSelect.value = String(currentStage);
  levelLabel.textContent = `${String(currentStage + 1).padStart(2, "0")}/${String(CONFIG.stages.length).padStart(2, "0")}`;
  levelProgress.style.width = `${((currentStage + 1) / CONFIG.stages.length) * 100}%`;

  if (changedPhase) setPhase(nextPhase, true);
  if (playSound && (changedLevel || changedPhase)) {
    playActionSound("phase");
    playHapticEffect("phase");
  }
}

function setPhase(phase, force = false) {
  if (!PHASES.includes(phase)) return;
  if (!force && phase === currentPhase) return;

  currentPhase = phase;
  const profile = phaseProfile();
  phaseLabel.textContent = profile.label;
  debugPhase.value = phase;
  document.querySelectorAll("[data-phase]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.phase === phase);
  });

  setState(currentState, true);
  if (!force) {
    burstParticles(profile.voice, 20, worldToScreenX(), catY - 150 * baseScale());
    playActionSound("phase");
    playHapticEffect("phase");
  }
}

function setStage(index) {
  const nextStage = clamp(Number(index) || 0, 0, CONFIG.stages.length - 1);
  const localProgress = clamp((worldX - currentStage * LEVEL_WIDTH) / LEVEL_WIDTH, 0.18, 0.72);
  currentStage = nextStage;
  worldX = currentStage * LEVEL_WIDTH + localProgress * LEVEL_WIDTH;
  cameraX = clamp(worldX - width * 0.5, 0, Math.max(0, TOTAL_WORLD_WIDTH - width));
  syncLevelFromWorld(true);
}

function setState(state, force = false) {
  if (!STATES.includes(state)) return;
  if (!force && currentState === "down" && state !== "getting_up" && state !== "idle") return;
  if (!force && state === currentState) return;

  const previousState = currentState;
  currentState = state;
  if (force || previousState !== currentState) stateStartedAt = performance.now();
  stateLabel.textContent = state.toUpperCase();
  debugState.value = state;
  const animator = activeAnimator();
  if (!animator) return;
  animator.reset();
  animator.setFps(CONFIG.states[state].fps);
  fpsSlider.value = animator.fps;
  fpsValue.textContent = String(animator.fps);
}

function triggerAction(state, soundName = state) {
  setState(state, true);
  playActionSound(soundName);
  playHapticEffect(soundName);
}

function update(deltaTime, now) {
  if (!assetsReady) return;

  pollGamepads();
  handleMovement(deltaTime);
  updateStateMachine(now);
  activeAnimator()?.update(deltaTime);
  animators.butterfly?.update(deltaTime);
  updateRain(deltaTime);
  updateParticles(deltaTime);
  voicePulse = Math.max(0, voicePulse - deltaTime * 1.7);

  updateCamera(deltaTime);
}

function updateCamera(deltaTime) {
  const maxCameraX = Math.max(0, TOTAL_WORLD_WIDTH - width);
  const leftEdge = width * 0.32;
  const rightEdge = width * 0.68;
  const screenX = worldX - cameraX;
  let targetX = cameraX;

  if (screenX > rightEdge) {
    targetX = worldX - rightEdge;
  } else if (screenX < leftEdge) {
    targetX = worldX - leftEdge;
  }

  targetX = clamp(targetX, 0, maxCameraX);
  cameraX += (targetX - cameraX) * Math.min(1, deltaTime * 7);
  if (Math.abs(targetX - cameraX) < 0.5) cameraX = targetX;
}

function handleMovement(deltaTime) {
  const left = pressed.has("KeyA") || pressed.has("ArrowLeft");
  const right = pressed.has("KeyD") || pressed.has("ArrowRight");
  const shift = pressed.has("ShiftLeft") || pressed.has("ShiftRight");
  let axisX = (right ? 1 : 0) - (left ? 1 : 0);

  if (Math.abs(joystickState.x) > 0.12) axisX = joystickState.x;
  if (Math.abs(gamepadAxisX) > 0.12) axisX = gamepadAxisX;
  if (touchRun && Math.abs(axisX) < 0.12) axisX = facing;

  if (Math.abs(axisX) > 0.12) facing = axisX < 0 ? -1 : 1;

  const locked = ["jump", "attack", "getting_up"].includes(currentState);
  const resting = currentState === "down";
  const grooming = currentState === "licking_fur";
  const canMove = !locked && !resting && !grooming && !manualDebug;

  if (canMove && Math.abs(axisX) > 0.12) {
    const running = shift || touchRun || gamepadRun || Math.abs(axisX) > 0.72;
    const profile = phaseProfile();
    const speed = (running ? 250 * profile.runSpeed : 135 * profile.speed) * Math.abs(axisX);
    worldX += Math.sign(axisX) * speed * deltaTime;
    worldX = clamp(worldX, 160, TOTAL_WORLD_WIDTH - 180);
    syncLevelFromWorld(true);
    setState(running ? "run" : "walk");
    return;
  }

  if (canMove) setState("idle");
}

function updateStateMachine(now) {
  const animator = activeAnimator();
  if (!animator) return;

  if (currentState === "jump" && animator.finished) setState("idle", true);
  if (currentState === "attack" && animator.finished) setState("idle", true);
  if (currentState === "getting_up" && animator.finished) setState("idle", true);

  const stateConfig = CONFIG.states[currentState];
  if (currentState === "licking_fur" && stateConfig.duration && animator.elapsed > 0 && performance.now() - stateStartedAt > stateConfig.duration) {
    setState("idle", true);
  }
}

let stateStartedAt = 0;

function updateRain(deltaTime) {
  for (const drop of rain) {
    drop.x -= drop.speed * 0.12 * deltaTime;
    drop.y += drop.speed * deltaTime;
    if (drop.y > height + 30) {
      drop.y = -30;
      drop.x = Math.random() * width;
    }
    if (drop.x < -40) drop.x = width + Math.random() * 60;
  }
}

function updateParticles(deltaTime) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.age += deltaTime;
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vy += 18 * deltaTime;
    if (particle.age > particle.life) particles.splice(i, 1);
  }
}

function draw(now) {
  ctx.clearRect(0, 0, width, height);
  drawStage();
  drawAtmosphere(now);
  drawButterfly(now);
  drawCat(now);
}

function drawStage() {
  const levelIndex = clamp(Math.floor(worldX / LEVEL_WIDTH), 0, CONFIG.stages.length - 1);
  const localProgress = clamp((worldX - levelIndex * LEVEL_WIDTH) / LEVEL_WIDTH, 0, 1);
  const maxLevelCameraTravel = Math.max(1, LEVEL_WIDTH - width);
  const cameraProgress = clamp((cameraX - levelIndex * LEVEL_WIDTH) / maxLevelCameraTravel, 0, 1);
  const image = stageImages[levelIndex];
  if (!image) {
    drawFallbackStage();
    return;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  drawStageImage(image, cameraProgress, 1);

  if (localProgress > 0.82 && stageImages[levelIndex + 1]) {
    const blend = (localProgress - 0.82) / 0.18;
    drawStageImage(stageImages[levelIndex + 1], 0.12, blend);
  } else if (localProgress < 0.18 && stageImages[levelIndex - 1]) {
    const blend = (0.18 - localProgress) / 0.18;
    drawStageImage(stageImages[levelIndex - 1], 0.88, blend);
  }

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.45, 80, width * 0.5, height * 0.45, Math.max(width, height) * 0.72);
  vignette.addColorStop(0, "rgba(8, 7, 22, 0)");
  vignette.addColorStop(1, "rgba(8, 7, 22, 0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawStageImage(image, progress, alpha) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const maxPan = Math.max(0, drawW - width);
  const pan = clamp(progress, 0, 1) * maxPan;
  const y = (height - drawH) * 0.56;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, -Math.round(pan), Math.round(y), Math.ceil(drawW), Math.ceil(drawH));
  ctx.restore();
}

function drawFallbackStage() {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#05040f");
  sky.addColorStop(1, "#171030");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
}

function drawAtmosphere(now) {
  const stageIsOutdoor = currentStage > 2;
  const alpha = stageIsOutdoor ? 0.28 : 0.08;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1;
  for (const drop of rain) {
    ctx.strokeStyle = drop.color;
    ctx.beginPath();
    ctx.moveTo(Math.round(drop.x), Math.round(drop.y));
    ctx.lineTo(Math.round(drop.x - drop.length * 0.18), Math.round(drop.y + drop.length));
    ctx.stroke();
  }
  ctx.restore();

  const glowY = catY + 8;
  const glow = ctx.createRadialGradient(width * 0.5, glowY, 8, width * 0.5, glowY, width * 0.38);
  glow.addColorStop(0, "rgba(0, 240, 255, 0.16)");
  glow.addColorStop(0.42, "rgba(255, 42, 157, 0.08)");
  glow.addColorStop(1, "rgba(8, 7, 22, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, height * 0.55, width, height * 0.45);

  for (const particle of particles) {
    const life = 1 - particle.age / particle.life;
    ctx.save();
    ctx.globalAlpha = life;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size);
    ctx.restore();
  }
}

function drawButterfly(now) {
  const profile = phaseProfile();
  const scale = baseScale();
  const react = voicePulse;
  const x = worldToScreenX() + facing * 110 * scale + Math.sin(now * 0.0024) * 20;
  const y = catY - 160 * scale - react * 58 + Math.sin(now * 0.004) * 12;

  if (animators.butterfly?.image) {
    animators.butterfly.draw(ctx, x, y + 48 * scale, 0.24 + react * 0.04, false, false, 0.95);
  } else {
    ctx.save();
    ctx.fillStyle = profile.voice;
    ctx.shadowColor = profile.voice;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(x - 8, y, 10, 6, -0.6, 0, Math.PI * 2);
    ctx.ellipse(x + 8, y, 10, 6, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawCat(now) {
  const animator = activeAnimator();
  const profile = phaseProfile();
  const scale = baseScale();
  const screenX = worldToScreenX();

  if (!animator) {
    drawFallbackCat(ctx, screenX, catY, scale, facing < 0);
    return;
  }

  const jumpProgress = currentState === "jump" ? Math.sin((animator.currentFrame / Math.max(1, animator.totalFrames - 1)) * Math.PI) : 0;
  const jumpOffset = jumpProgress * 86 * profile.jumpHeight;
  const bob = currentState === "idle" ? Math.sin(now * 0.004) * 2 : 0;
  const y = catY - jumpOffset + bob;

  drawCatShadow(screenX, catY, scale, jumpProgress);
  drawCatGlow(screenX, y, scale, profile.glow);
  if (voicePulse > 0) drawVoicePulse(screenX, y - 140 * scale, scale, profile.voice);

  animator.draw(ctx, screenX, y, scale, facing < 0, gridCheck.checked);
}

function drawCatShadow(x, y, scale, jumpProgress) {
  ctx.save();
  const shrink = 1 - jumpProgress * 0.35;
  ctx.translate(Math.round(x), Math.round(y + 4));
  ctx.scale(shrink, 0.34 * shrink);
  ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
  ctx.shadowColor = CONFIG.palette.cyan;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(0, 0, 62 * scale, 22 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCatGlow(x, y, scale, color) {
  ctx.save();
  const glow = ctx.createRadialGradient(x, y - 90 * scale, 10, x, y - 90 * scale, 150 * scale);
  glow.addColorStop(0, hexToRgba(color, 0.18));
  glow.addColorStop(0.44, "rgba(255, 42, 157, 0.1)");
  glow.addColorStop(1, "rgba(8, 7, 22, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - 180 * scale, y - 260 * scale, 360 * scale, 300 * scale);
  ctx.restore();
}

function drawVoicePulse(x, y, scale, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.76 * voicePulse;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(x + facing * (42 + i * 24) * scale, y - i * 8, (18 + i * 16 + (1 - voicePulse) * 32) * scale, -0.6, 0.6);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFallbackCat(ctx, x, y, scale, flipX) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -scale : scale, scale);
  ctx.fillStyle = "#21114b";
  ctx.shadowColor = CONFIG.palette.magenta;
  ctx.shadowBlur = 10;
  ctx.fillRect(-34, -70, 68, 42);
  ctx.fillRect(-18, -112, 42, 44);
  ctx.fillStyle = CONFIG.palette.magenta;
  ctx.fillRect(-18, -124, 12, 18);
  ctx.fillRect(12, -124, 12, 18);
  ctx.fillStyle = CONFIG.palette.yellow;
  ctx.fillRect(-7, -96, 7, 9);
  ctx.fillRect(9, -96, 7, 9);
  ctx.restore();
}

function worldToScreenX() {
  return worldX - cameraX;
}

function triggerVoice() {
  const profile = phaseProfile();
  voicePulse = 1;
  burstParticles(profile.voice, currentPhase === "idoso" ? 34 : 26, worldToScreenX() + facing * 110 * baseScale(), catY - 155 * baseScale());
  playActionSound("voice");
  playHapticEffect("voice");
}

function burstParticles(color, count, x, y) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 28 + Math.random() * 88;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 28,
      age: 0,
      life: 0.55 + Math.random() * 0.7,
      size: 2 + Math.floor(Math.random() * 3),
      color: Math.random() > 0.35 ? color : CONFIG.palette.yellow,
    });
  }
}

function pollGamepads() {
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];

  if (!pads.length) {
    activeGamepadIndex = null;
    gamepadAxisX = 0;
    gamepadRun = false;
    gamepadLabel.textContent = "TECLADO/TOQUE";
    updateHapticDeviceStatus();
    return;
  }

  const gamepad = pads.find((pad) => pad.index === activeGamepadIndex) || pads[0];
  activeGamepadIndex = gamepad.index;
  gamepadLabel.textContent = gamepad.id.includes("DualSense") ? "DUALSENSE" : gamepad.id.slice(0, 18).toUpperCase();
  updateHapticDeviceStatus();

  const axis = applyDeadzone(gamepad.axes[0] || 0, 0.18);
  const dpadLeft = isButtonPressed(gamepad, 14);
  const dpadRight = isButtonPressed(gamepad, 15);
  const dpadAxis = (dpadRight ? 1 : 0) - (dpadLeft ? 1 : 0);
  gamepadAxisX = Math.abs(dpadAxis) > 0 ? dpadAxis : axis;
  gamepadRun = getButtonValue(gamepad, 7) > 0.25;

  const previous = previousGamepadButtons.get(gamepad.index) || [];
  const justPressed = (index) => isButtonPressed(gamepad, index) && !previous[index];

  if (justPressed(0)) {
    unlockAudio();
    triggerAction("jump");
  }
  if (justPressed(2)) {
    unlockAudio();
    triggerAction("attack");
  }
  if (justPressed(1)) {
    unlockAudio();
    triggerAction("down");
  }
  if (justPressed(3)) {
    unlockAudio();
    triggerAction("getting_up", "up");
  }
  if (justPressed(4)) {
    unlockAudio();
    triggerAction("licking_fur", "purr");
  }
  if (justPressed(5)) {
    unlockAudio();
    triggerVoice();
  }
  if (justPressed(9)) {
    unlockAudio();
    setStage((currentStage + 1) % CONFIG.stages.length);
    playActionSound("phase");
  }
  if (justPressed(8)) {
    unlockAudio();
    setStage((currentStage + CONFIG.stages.length - 1) % CONFIG.stages.length);
    playActionSound("phase");
  }
  if (justPressed(12)) {
    unlockAudio();
    cyclePhase(-1);
  }
  if (justPressed(13)) {
    unlockAudio();
    cyclePhase(1);
  }

  previousGamepadButtons.set(gamepad.index, gamepad.buttons.map((button) => button.pressed || button.value > 0.5));
}

function cyclePhase(direction) {
  const index = PHASES.indexOf(currentPhase);
  const nextIndex = (index + direction + PHASES.length) % PHASES.length;
  jumpToPhase(PHASES[nextIndex]);
}

function jumpToPhase(phase) {
  const range = PHASE_LEVEL_RANGES.find((item) => item.phase === phase);
  if (!range) return;
  setStage(range.start);
}

function isButtonPressed(gamepad, index) {
  const button = gamepad.buttons[index];
  return Boolean(button && (button.pressed || button.value > 0.5));
}

function getButtonValue(gamepad, index) {
  const button = gamepad.buttons[index];
  return button ? Math.max(button.value || 0, button.pressed ? 1 : 0) : 0;
}

function applyDeadzone(value, deadzone) {
  if (Math.abs(value) < deadzone) return 0;
  return Math.sign(value) * ((Math.abs(value) - deadzone) / (1 - deadzone));
}

function getCurrentGamepad() {
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
  if (!pads.length) return null;
  return pads.find((pad) => pad.index === activeGamepadIndex) || pads[0];
}

function getRumbleActuator(gamepad) {
  if (!gamepad) return null;
  if (gamepad.vibrationActuator) return gamepad.vibrationActuator;
  if (gamepad.hapticActuators?.length) return gamepad.hapticActuators[0];
  return null;
}

function hapticIntensity() {
  return clamp(Number(hapticsStrength?.value) || 0.85, 0.2, 1);
}

function playHapticEffect(name) {
  const effect = HAPTIC_EFFECTS[name];
  if (!effect) return;

  const intensity = hapticIntensity();
  const gamepad = getCurrentGamepad();
  const actuator = getRumbleActuator(gamepad);
  let usedDevice = false;

  if (actuator) {
    usedDevice = true;
    effect.rumble.forEach((segment) => playRumbleSegment(actuator, segment, intensity));
  }

  if (navigator.vibrate) {
    usedDevice = true;
    navigator.vibrate(scaleVibrationPattern(effect.mobilePattern, intensity));
  }

  setHapticStatus(
    usedDevice
      ? `${effect.label}: efeito enviado para ${actuator ? "controle" : "mobile/browser"}.`
      : "Este navegador/dispositivo nao expos vibracao. Os efeitos continuam ligados para quando houver suporte."
  );
}

function playRumbleSegment(actuator, segment, intensity) {
  const duration = Math.max(10, Math.round(segment.duration));
  const startDelay = Math.max(0, Math.round(segment.delay || 0));
  const weakMagnitude = clamp(segment.weak * intensity, 0, 1);
  const strongMagnitude = clamp(segment.strong * intensity, 0, 1);

  try {
    if (typeof actuator.playEffect === "function") {
      actuator.playEffect("dual-rumble", {
        startDelay,
        duration,
        weakMagnitude,
        strongMagnitude,
      });
      return;
    }

    if (typeof actuator.pulse === "function") {
      window.setTimeout(() => actuator.pulse(Math.max(weakMagnitude, strongMagnitude), duration), startDelay);
    }
  } catch (error) {
    setHapticStatus("O navegador reconheceu o controle, mas bloqueou o motor de vibracao.");
  }
}

function scaleVibrationPattern(pattern, intensity) {
  return pattern.map((duration, index) => {
    if (index % 2 === 1) return duration;
    return Math.max(8, Math.round(duration * (0.55 + intensity * 0.7)));
  });
}

function setHapticStatus(message) {
  lastHapticStatus = message;
  if (hapticsStatus) hapticsStatus.textContent = message;
}

function updateHapticDeviceStatus() {
  const gamepad = getCurrentGamepad();
  const hasRumble = Boolean(getRumbleActuator(gamepad));
  const hasMobileVibrate = Boolean(navigator.vibrate);

  if (lastHapticStatus) return;
  if (hasRumble) {
    setHapticStatus("Controle com vibracao detectado. Teste os efeitos abaixo.");
  } else if (hasMobileVibrate) {
    setHapticStatus("Vibracao mobile/browser detectada. Teste os efeitos abaixo.");
  } else {
    setHapticStatus("Sem motor de vibracao exposto pelo navegador. Conecte o DualSense por USB/Bluetooth e pressione um botao.");
  }
}

function unlockAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function stopSoundtrack() {
  if (!currentSoundtrackAudio) return;
  currentSoundtrackAudio.pause();
  currentSoundtrackAudio.removeAttribute("src");
  currentSoundtrackAudio.load();
  currentSoundtrackAudio = null;
}

function setSoundtrack(index) {
  stopSoundtrack();
  soundtrackSelect.value = index;
  beatSoundtrackSelect.value = index;
  if (index === "") return;
  const soundtrack = CONFIG.soundtracks[Number(index)];
  if (!soundtrack) return;

  currentSoundtrackAudio = new Audio(soundtrack.file);
  currentSoundtrackAudio.loop = true;
  currentSoundtrackAudio.volume = 0.48;
  currentSoundtrackAudio.addEventListener("error", () => {
    warnings.push(`Trilha nao encontrada: ${soundtrack.file}.`);
    updateWarnings();
  }, { once: true });
  currentSoundtrackAudio.play().catch(() => {
    warnings.push("Clique novamente na trilha se o navegador bloquear o primeiro play.");
    updateWarnings();
  });
}

function populateSoundtrackSelect(selectElement) {
  const silenceOption = document.createElement("option");
  silenceOption.value = "";
  silenceOption.textContent = document.documentElement.lang === "en" ? "No soundtrack" : "Sem trilha";
  selectElement.appendChild(silenceOption);

  CONFIG.soundtracks.forEach((soundtrack, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = soundtrack.label;
    selectElement.appendChild(option);
  });
}

function playActionSound(action) {
  if (!audioContext || !masterGain) return;
  if (audioContext.state === "suspended") return;

  if (action === "voice") {
    playMeow();
  } else if (action === "jump") {
    playTone({ type: "triangle", start: 420, end: 760, duration: 0.16, gain: 0.22 });
  } else if (action === "attack") {
    playTone({ type: "sawtooth", start: 220, end: 90, duration: 0.13, gain: 0.18 });
    playNoise(0.08, 0.16);
  } else if (action === "down") {
    playTone({ type: "sine", start: 180, end: 70, duration: 0.22, gain: 0.2 });
  } else if (action === "up") {
    playTone({ type: "triangle", start: 180, end: 520, duration: 0.2, gain: 0.18 });
  } else if (action === "care") {
    playTone({ type: "sine", start: 520, end: 580, duration: 0.1, gain: 0.1, delay: 0 });
    playTone({ type: "sine", start: 620, end: 690, duration: 0.12, gain: 0.1, delay: 0.08 });
  } else if (action === "purr") {
    playTone({ type: "sine", start: 95, end: 82, duration: 0.34, gain: 0.08, delay: 0 });
    playTone({ type: "sine", start: 115, end: 98, duration: 0.32, gain: 0.055, delay: 0.24 });
    playTone({ type: "sine", start: 90, end: 78, duration: 0.28, gain: 0.05, delay: 0.5 });
  } else if (action === "phase") {
    playTone({ type: "square", start: 330, end: 660, duration: 0.1, gain: 0.11 });
    playTone({ type: "square", start: 660, end: 990, duration: 0.13, gain: 0.09, delay: 0.09 });
  }
}

function playMeow() {
  const profile = phaseProfile();
  const base = currentPhase === "filhote" ? 720 : currentPhase === "adulto" ? 520 : 390;
  const end = currentPhase === "idoso" ? 310 : base * 0.62;
  playTone({ type: "sine", start: base, end, duration: 0.34, gain: 0.16 });
  playTone({ type: "triangle", start: base * 1.5, end: end * 1.2, duration: 0.22, gain: 0.055, delay: 0.04 });
  burstParticles(profile.voice, 8, worldToScreenX() + facing * 92 * baseScale(), catY - 150 * baseScale());
}

function playTone({ type, start, end, duration, gain, delay = 0 }) {
  const now = audioContext.currentTime + delay;
  const osc = audioContext.createOscillator();
  const amp = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(start, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, end), now + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2600, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(filter);
  filter.connect(amp);
  amp.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playNoise(duration, gain) {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audioContext.createBufferSource();
  const amp = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;

  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.8;
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(amp);
  amp.connect(masterGain);
  source.start(now);
  source.stop(now + duration);
}

class RainSystem {
  constructor(count = 90) {
    this.count = count;
    this.drops = [];
    this.enabled = true;
  }

  resize(width, height) {
    this.drops = Array.from({ length: this.count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 260 + Math.random() * 560,
      length: 10 + Math.random() * 18,
      tint: Math.random() > 0.5 ? "rgba(0, 234, 255, 0.42)" : "rgba(255, 42, 157, 0.28)",
    }));
  }

  update(deltaTime, width, height, boost = 0) {
    for (const drop of this.drops) {
      drop.x -= (60 + boost * 80) * deltaTime;
      drop.y += (drop.speed + boost * 260) * deltaTime;
      if (drop.y > height + 30 || drop.x < -30) {
        drop.x = Math.random() * width;
        drop.y = -30;
      }
    }
  }

  draw(ctx) {
    if (!this.enabled) return;
    ctx.save();
    ctx.lineWidth = 1;
    for (const drop of this.drops) {
      ctx.strokeStyle = drop.tint;
      ctx.beginPath();
      ctx.moveTo(Math.round(drop.x), Math.round(drop.y));
      ctx.lineTo(Math.round(drop.x - drop.length * 0.2), Math.round(drop.y + drop.length));
      ctx.stroke();
    }
    ctx.restore();
  }
}

class NeonBackground {
  draw(ctx, width, height, time, mode) {
    if (mode === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    } else if (mode === "checker") {
      this.drawChecker(ctx, width, height);
    } else if (mode === "transparent") {
      this.drawTransparentReview(ctx, width, height);
    } else {
      this.drawCity(ctx, width, height, time);
    }
  }

  drawCity(ctx, width, height, time) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#070512");
    sky.addColorStop(0.58, "#150b32");
    sky.addColorStop(1, "#05040c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 11; i += 1) {
      const x = ((i * 143 + Math.sin(time * 0.0002 + i) * 10) % (width + 160)) - 80;
      const w = 54 + (i % 4) * 22;
      const h = height * (0.28 + (i % 5) * 0.05);
      ctx.fillStyle = i % 2 ? "rgba(36, 18, 79, 0.58)" : "rgba(13, 10, 32, 0.82)";
      ctx.fillRect(Math.round(x), Math.round(height * 0.62 - h), w, h);
      ctx.fillStyle = i % 3 ? "rgba(0, 234, 255, 0.34)" : "rgba(255, 42, 157, 0.34)";
      for (let y = height * 0.62 - h + 18; y < height * 0.6; y += 24) {
        ctx.fillRect(Math.round(x + 10), Math.round(y), 12, 5);
        ctx.fillRect(Math.round(x + w - 24), Math.round(y + 8), 10, 5);
      }
    }

    const floorY = height * 0.72;
    const floor = ctx.createLinearGradient(0, floorY, 0, height);
    floor.addColorStop(0, "rgba(0, 234, 255, 0.11)");
    floor.addColorStop(0.28, "rgba(255, 42, 157, 0.16)");
    floor.addColorStop(1, "rgba(0, 0, 0, 0.74)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, floorY, width, height - floorY);

    ctx.strokeStyle = "rgba(0, 234, 255, 0.26)";
    for (let i = 0; i < 9; i += 1) {
      const y = floorY + i * i * 4.3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(247, 255, 60, 0.13)";
    ctx.fillRect(width * 0.08, floorY + 26, width * 0.22, 10);
    ctx.fillStyle = "rgba(255, 42, 157, 0.15)";
    ctx.fillRect(width * 0.58, floorY + 42, width * 0.28, 12);
  }

  drawChecker(ctx, width, height) {
    const size = 18;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        ctx.fillStyle = (x / size + y / size) % 2 ? "#252033" : "#413a52";
        ctx.fillRect(x, y, size, size);
      }
    }
  }

  drawTransparentReview(ctx, width, height) {
    ctx.fillStyle = "#070512";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(0, 234, 255, 0.18)";
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}

class TextBox {
  constructor() {
    this.visible = true;
  }

  setBeat(beat, index) {
    beatCounter.textContent = `${index + 1}/8`;
    beatTitle.textContent = beat.title;
    beatSubtitle.textContent = beat.subtitle;
    beatCopy.textContent = beat.textBox;
  }

  setVisible(visible) {
    this.visible = visible;
    beatTextBox.classList.toggle("is-hidden", !visible);
  }
}

class SpriteSheetPlayer {
  constructor(config) {
    this.beats = config.beats;
    this.frame = config.frame;
    this.beatIndex = 0;
    this.sheetIndex = 0;
    this.frameIndex = 0;
    this.fps = this.beats[0].defaultFps;
    this.elapsed = 0;
    this.playing = true;
    this.autoplaySequence = true;
    this.scale = 1.65;
    this.showBounds = false;
    this.showGridInfo = false;
    this.backgroundMode = "dark";
    this.warnings = [];
    this.loadedSheets = [];
    this.frameRectCache = new WeakMap();
    this.loading = false;
    this.bodyPulse = 0;
    this.voicePulse = 0;
  }

  async load() {
    await this.setBeat(this.beatIndex);
  }

  play() {
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.pause();
    this.reset();
  }

  reset() {
    this.sheetIndex = 0;
    this.frameIndex = 0;
    this.elapsed = 0;
  }

  async setBeat(beatIndex) {
    this.beatIndex = clamp(beatIndex, 0, this.beats.length - 1);
    const beat = this.currentBeat();
    this.loading = true;
    this.warnings = [];
    this.loadedSheets = [];
    this.sheetIndex = 0;
    this.frameIndex = 0;
    this.fps = beat.defaultFps;
    beatFpsSlider.value = String(this.fps);
    beatSequenceSelect.value = String(this.beatIndex);
    textBox.setBeat(beat, this.beatIndex);
    playBeatAmbience(beat.id);

    for (const file of beat.files) {
      const image = await loadBeatImage(`${beat.assetFolder}/${file}`);
      if (image) this.loadedSheets.push(image);
      else this.warnings.push(`Ignorado: ${file}`);
    }

    if (!this.loadedSheets.length) this.warnings.push(`Nenhum asset carregado para ${beat.id}.`);
    this.loading = false;
    this.play();
    this.updateUi();
  }

  currentBeat() {
    return this.beats[this.beatIndex];
  }

  currentSheet() {
    return this.loadedSheets[this.sheetIndex] || null;
  }

  frameRectsFor(sheet) {
    if (!sheet) return [];
    if (this.frameRectCache.has(sheet)) return this.frameRectCache.get(sheet);
    const rects = Array.from({ length: this.frame.totalFrames }, (_, frame) => {
      const col = frame % this.frame.columns;
      const row = Math.floor(frame / this.frame.columns);
      const x0 = Math.round((sheet.width * col) / this.frame.columns);
      const x1 = Math.round((sheet.width * (col + 1)) / this.frame.columns);
      const y0 = Math.round((sheet.height * row) / this.frame.rows);
      const y1 = Math.round((sheet.height * (row + 1)) / this.frame.rows);
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    });
    this.frameRectCache.set(sheet, rects);
    return rects;
  }

  nextFrame() {
    if (this.loadedSheets.length) {
      this.frameIndex += 1;
      if (this.frameIndex >= this.frame.totalFrames) {
        this.frameIndex = 0;
        this.sheetIndex += 1;
        if (this.sheetIndex >= this.loadedSheets.length) {
          this.sheetIndex = 0;
        }
      }
    }
    this.updateUi();
  }

  previousFrame() {
    if (this.loadedSheets.length) {
      this.frameIndex -= 1;
      if (this.frameIndex < 0) {
        this.sheetIndex = (this.sheetIndex - 1 + this.loadedSheets.length) % this.loadedSheets.length;
        this.frameIndex = this.frame.totalFrames - 1;
      }
    }
    this.updateUi();
  }

  nextSheet() {
    if (!this.loadedSheets.length) return;
    this.sheetIndex = (this.sheetIndex + 1) % this.loadedSheets.length;
    this.frameIndex = 0;
    this.updateUi();
  }

  previousSheet() {
    if (!this.loadedSheets.length) return;
    this.sheetIndex = (this.sheetIndex - 1 + this.loadedSheets.length) % this.loadedSheets.length;
    this.frameIndex = 0;
    this.updateUi();
  }

  setFps(fps) {
    this.fps = clamp(Number(fps) || this.fps, 1, 24);
    this.updateUi();
  }

  update(deltaTime) {
    this.bodyPulse = Math.max(0, this.bodyPulse - deltaTime * 3);
    this.voicePulse = Math.max(0, this.voicePulse - deltaTime * 2.1);
    if (!this.playing || this.loading || !this.loadedSheets.length) return;

    this.elapsed += deltaTime;
    const frameTime = 1 / this.fps;
    while (this.elapsed >= frameTime) {
      this.elapsed -= frameTime;
      this.frameIndex += 1;
      if (this.frameIndex >= this.frame.totalFrames) {
        this.frameIndex = 0;
        this.sheetIndex += 1;
        if (this.sheetIndex >= this.loadedSheets.length) {
          this.handleBeatEnd();
          break;
        }
      }
    }
    this.updateUi();
  }

  handleBeatEnd() {
    if (this.autoplaySequence && this.beatIndex < this.beats.length - 1) {
      this.setBeat(this.beatIndex + 1);
      return;
    }
    this.sheetIndex = Math.max(0, this.loadedSheets.length - 1);
    this.frameIndex = this.frame.totalFrames - 1;
    this.pause();
  }

  draw(ctx, width, height) {
    const sheet = this.currentSheet();
    const groundY = height * 0.66;
    const x = width * 0.5 + Math.sin(performance.now() * 0.0012) * this.bodyPulse * 8;
    const scale = this.scale * (1 + this.bodyPulse * 0.035);

    if (!sheet) {
      this.drawPlaceholder(ctx, width, height);
      return;
    }

    const rect = this.frameRectsFor(sheet)[this.frameIndex];
    const dw = this.frame.frameWidth * scale;
    const dh = this.frame.frameHeight * scale;
    const dx = Math.round(x - dw / 2);
    const dy = Math.round(groundY - dh);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.shadowColor = this.beatIndex >= 5 ? "#00eaff" : "#ff2a9d";
    ctx.shadowBlur = 18 + this.voicePulse * 22;
    ctx.drawImage(sheet, rect.x, rect.y, rect.w, rect.h, dx, dy, dw, dh);
    ctx.restore();

    if (this.voicePulse > 0) this.drawVoiceWave(ctx, x, groundY - dh * 0.58, scale);
    if (this.showBounds) drawBounds(ctx, dx, dy, dw, dh, "rgba(44, 255, 143, 0.86)");
    if (this.showGridInfo) this.drawGridInfo(ctx, x, groundY, dw, dh);
  }

  drawVoiceWave(ctx, x, y, scale) {
    ctx.save();
    ctx.strokeStyle = "#00eaff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.75 * this.voicePulse;
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 18;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 54 * scale + i * 22, y, (16 + i * 16 + (1 - this.voicePulse) * 30) * scale, -0.7, 0.7);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGridInfo(ctx, x, groundY, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(247, 255, 60, 0.8)";
    ctx.beginPath();
    ctx.moveTo(x - 18, groundY);
    ctx.lineTo(x + 18, groundY);
    ctx.moveTo(x, groundY - 18);
    ctx.lineTo(x, groundY + 18);
    ctx.stroke();
    ctx.fillStyle = "rgba(7, 5, 18, 0.72)";
    ctx.fillRect(x - w / 2, groundY - h - 22, 196, 18);
    ctx.fillStyle = "#f7ff3c";
    ctx.font = "11px 'Lucida Console', monospace";
    ctx.fillText(`sheet ${this.sheetIndex + 1}/${this.loadedSheets.length} frame ${this.frameIndex + 1}/32`, x - w / 2 + 6, groundY - h - 9);
    ctx.restore();
  }

  drawPlaceholder(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = "rgba(13, 10, 32, 0.78)";
    ctx.strokeStyle = "#ff2a9d";
    ctx.lineWidth = 2;
    ctx.fillRect(width * 0.5 - 150, height * 0.48 - 80, 300, 160);
    ctx.strokeRect(width * 0.5 - 150, height * 0.48 - 80, 300, 160);
    ctx.fillStyle = "#f7ff3c";
    ctx.font = "14px 'Lucida Console', monospace";
    ctx.textAlign = "center";
    ctx.fillText(this.currentBeat().title, width * 0.5, height * 0.48);
    ctx.fillStyle = "#00eaff";
    ctx.fillText("sem assets carregados", width * 0.5, height * 0.48 + 24);
    ctx.restore();
  }

  updateUi() {
    const totalBeatFrames = this.loadedSheets.length * this.frame.totalFrames;
    const totalSeqFrames = this.beats.reduce((sum, beat) => sum + beat.files.length * this.frame.totalFrames, 0);
    beatPlayState.textContent = this.loading ? "LOAD" : this.playing ? "PLAY" : "PAUSE";
    beatIndexLabel.textContent = String(this.beatIndex + 1).padStart(2, "0");
    sheetIndexLabel.textContent = `${String(this.sheetIndex + 1).padStart(2, "0")}/${String(this.loadedSheets.length).padStart(2, "0")}`;
    frameIndexLabel.textContent = `${String(this.frameIndex).padStart(2, "0")}/31`;
    beatFpsLabel.textContent = String(this.fps);
    beatDurationLabel.textContent = `${(totalBeatFrames / this.fps).toFixed(1)}s`;
    beatTotalFramesLabel.textContent = String(totalBeatFrames);
    sequenceTotalFramesLabel.textContent = String(totalSeqFrames);
    beatWarnings.innerHTML = this.warnings.map((warning) => `<div>${escapeHtml(warning)}</div>`).join("");
    beatFpsSlider.value = String(this.fps);
    document.querySelectorAll(".beat-marker").forEach((button, index) => {
      button.classList.toggle("is-active", index === this.beatIndex);
    });
    document.querySelectorAll(".sequence-beat-button").forEach((button, index) => {
      button.classList.toggle("is-active", index === this.beatIndex);
    });
    beatSequenceSelect.value = String(this.beatIndex);
  }
}

class CinematicIntro {
  constructor() {
    this.canvas = beatCanvas;
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.background = new NeonBackground();
    this.rain = new RainSystem();
    this.player = new SpriteSheetPlayer({ beats: BEATS, frame: BEAT_FRAME });
    this.active = true;
    this.lastTime = 0;
    this.width = 1;
    this.height = 1;
  }

  async init() {
    this.buildTimeline();
    this.bindUi();
    this.setDebugVisible(false);
    this.resize();
    await this.player.load();
    requestAnimationFrame((now) => {
      this.lastTime = now;
      this.loop(now);
    });
  }

  buildTimeline() {
    beatTimeline.innerHTML = "";
    beatSequenceList.innerHTML = "";
    beatSequenceSelect.innerHTML = "";
    BEATS.forEach((beat, index) => {
      const button = document.createElement("button");
      button.className = "beat-marker";
      button.type = "button";
      button.textContent = String(index + 1).padStart(2, "0");
      button.title = `${String(index + 1).padStart(2, "0")} - ${beat.title}`;
      button.addEventListener("click", () => this.player.setBeat(index));
      beatTimeline.appendChild(button);

      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${String(index + 1).padStart(2, "0")} - ${beat.title}`;
      beatSequenceSelect.appendChild(option);

      const sequenceButton = document.createElement("button");
      sequenceButton.className = "sequence-beat-button";
      sequenceButton.type = "button";
      sequenceButton.innerHTML = `<strong>${String(index + 1).padStart(2, "0")} ${escapeHtml(beat.title)}</strong><span>${escapeHtml(beat.subtitle)}</span>`;
      sequenceButton.addEventListener("click", () => this.player.setBeat(index));
      beatSequenceList.appendChild(sequenceButton);
    });
  }

  bindUi() {
    document.querySelectorAll("[data-cine]").forEach((button) => {
      button.addEventListener("click", () => this.handleCommand(button.dataset.cine));
    });
    beatFpsSlider.addEventListener("input", () => this.player.setFps(beatFpsSlider.value));
    beatSequenceSelect.addEventListener("change", () => {
      this.player.setBeat(Number(beatSequenceSelect.value));
    });
    beatScaleSlider.addEventListener("input", () => {
      this.player.scale = Number(beatScaleSlider.value);
    });
    beatBackgroundMode.addEventListener("change", () => {
      this.player.backgroundMode = beatBackgroundMode.value;
    });
    beatAutoplayToggle.addEventListener("change", () => {
      this.player.autoplaySequence = beatAutoplayToggle.checked;
    });
    beatBoundsToggle.addEventListener("change", () => {
      this.player.showBounds = beatBoundsToggle.checked;
    });
    beatGridToggle.addEventListener("change", () => {
      this.player.showGridInfo = beatGridToggle.checked;
    });
    beatRainToggle.addEventListener("change", () => {
      this.rain.enabled = beatRainToggle.checked;
    });
    beatTextToggle.addEventListener("change", () => {
      textBox.setVisible(beatTextToggle.checked);
    });
    beatDebugToggle.addEventListener("change", () => {
      this.setDebugVisible(beatDebugToggle.checked);
    });
    closeCinematicButton.addEventListener("click", () => this.close());
    cinematicBodyButton.addEventListener("click", () => {
      unlockAudio();
      this.player.bodyPulse = 1;
      playHapticEffect("jump");
      triggerCue("tiny_steps");
    });
    cinematicVoiceButton.addEventListener("click", () => {
      unlockAudio();
      this.player.voicePulse = 1;
      this.player.bodyPulse = 0.25;
      triggerVoice();
    });
    window.addEventListener("resize", () => this.resize());
  }

  handleCommand(command) {
    const actions = {
      playPause: () => (this.player.playing ? this.player.pause() : this.player.play()),
      nextBeat: () => this.player.setBeat((this.player.beatIndex + 1) % BEATS.length),
      prevBeat: () => this.player.setBeat((this.player.beatIndex - 1 + BEATS.length) % BEATS.length),
      restart: () => this.player.reset(),
      nextSheet: () => this.player.nextSheet(),
      prevSheet: () => this.player.previousSheet(),
      nextFrame: () => this.player.nextFrame(),
      prevFrame: () => this.player.previousFrame(),
    };
    actions[command]?.();
  }

  setDebugVisible(visible) {
    beatDebugToggle.checked = visible;
    beatTechPanel.classList.toggle("is-hidden", !visible);
    beatOptionsPanel.classList.toggle("is-hidden", !visible);
  }

  handleShortcut(event) {
    if (!this.active) return false;
    if (event.target && ["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return false;
    const key = event.key;
    if (event.code === "Space") this.handleCommand("playPause");
    else if (event.code === "ArrowRight") this.handleCommand("nextBeat");
    else if (event.code === "ArrowLeft") this.handleCommand("prevBeat");
    else if (event.code === "KeyR") this.handleCommand("restart");
    else if (event.code === "KeyD") {
      this.setDebugVisible(!beatDebugToggle.checked);
    } else if (event.code === "KeyT") {
      beatTextToggle.checked = !beatTextToggle.checked;
      textBox.setVisible(beatTextToggle.checked);
    } else if (event.code === "KeyF") this.handleCommand("nextFrame");
    else if (event.code === "KeyG") this.handleCommand("prevFrame");
    else if (key === "+" || key === "=") this.player.setFps(this.player.fps + 1);
    else if (key === "-" || key === "_") this.player.setFps(this.player.fps - 1);
    else return false;
    return true;
  }

  resize() {
    const rect = gameFrame.getBoundingClientRect();
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.canvas.width = Math.floor(this.width * ratio);
    this.canvas.height = Math.floor(this.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.rain.resize(this.width, this.height);
  }

  loop(now) {
    const deltaTime = Math.min(0.05, (now - this.lastTime) / 1000 || 0);
    this.lastTime = now;
    if (this.active) {
      this.player.update(deltaTime);
      this.rain.update(deltaTime, this.width, this.height, this.player.voicePulse);
      this.draw(now);
    }
    requestAnimationFrame((next) => this.loop(next));
  }

  draw(now) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.background.draw(this.ctx, this.width, this.height, now, this.player.backgroundMode);
    this.rain.draw(this.ctx);
    this.drawParticles(now);
    this.player.draw(this.ctx, this.width, this.height);
    this.drawVignette();
  }

  drawParticles(now) {
    this.ctx.save();
    for (let i = 0; i < 24; i += 1) {
      const x = (i * 97 + now * 0.016) % this.width;
      const y = this.height * 0.22 + Math.sin(now * 0.001 + i) * 80 + (i % 5) * 34;
      this.ctx.fillStyle = i % 3 ? "rgba(0, 234, 255, 0.34)" : "rgba(247, 255, 60, 0.35)";
      this.ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
    }
    this.ctx.restore();
  }

  drawVignette() {
    const gradient = this.ctx.createRadialGradient(this.width * 0.5, this.height * 0.48, 80, this.width * 0.5, this.height * 0.48, Math.max(this.width, this.height) * 0.75);
    gradient.addColorStop(0, "rgba(7, 5, 18, 0)");
    gradient.addColorStop(1, "rgba(7, 5, 18, 0.62)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  close() {
    this.active = false;
    this.player.pause();
    stopBeatAmbience();
    cinematicIntroElement.classList.add("is-hidden");
  }

  open() {
    this.active = true;
    this.lastTime = performance.now();
    cinematicIntroElement.classList.remove("is-hidden");
    this.player.play();
    this.resize();
  }
}

class FrameChecker {
  constructor() {
    this.canvas = frameCheckerCanvas;
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.width = 1;
    this.height = 1;
    this.active = false;
    this.item = null;
    this.imageCache = new Map();
    this.boxCache = new WeakMap();
  }

  init() {
    this.populateControls();
    this.bindUi();
    this.resize();
    this.refreshSource();
    requestAnimationFrame(() => this.draw());
  }

  populateControls() {
    checkerPhase.innerHTML = "";
    checkerState.innerHTML = "";
    checkerBeat.innerHTML = "";

    for (const phase of PHASES) {
      const option = document.createElement("option");
      option.value = phase;
      option.textContent = CONFIG.phases[phase].label;
      checkerPhase.appendChild(option);
    }

    for (const state of STATES) {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state.toUpperCase();
      checkerState.appendChild(option);
    }

    BEATS.forEach((beat, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${String(index + 1).padStart(2, "0")} - ${beat.title}`;
      checkerBeat.appendChild(option);
    });

    this.populateSheetSelect();
  }

  populateSheetSelect() {
    const beat = BEATS[Number(checkerBeat.value) || 0];
    checkerSheet.innerHTML = "";
    beat.files.forEach((file, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${String(index + 1).padStart(2, "0")} ${file}`;
      checkerSheet.appendChild(option);
    });
  }

  bindUi() {
    frameCheckerButton.addEventListener("click", () => this.open());
    frameCheckerClose.addEventListener("click", () => this.close());
    checkerSource.addEventListener("change", () => {
      const beats = checkerSource.value === "beats";
      checkerGameplayControls.classList.toggle("is-hidden", beats);
      checkerBeatControls.classList.toggle("is-hidden", !beats);
      this.refreshSource();
    });
    checkerPhase.addEventListener("change", () => this.refreshSource());
    checkerState.addEventListener("change", () => this.refreshSource());
    checkerBeat.addEventListener("change", () => {
      this.populateSheetSelect();
      this.refreshSource();
    });
    checkerSheet.addEventListener("change", () => this.refreshSource());
    checkerFrame.addEventListener("input", () => this.syncLabels());
    checkerScale.addEventListener("input", () => this.syncLabels());
    checkerPrevAlpha.addEventListener("input", () => this.syncLabels());
    checkerNextAlpha.addEventListener("input", () => this.syncLabels());
    checkerPrevFrame.addEventListener("click", () => this.stepFrame(-1));
    checkerNextFrame.addEventListener("click", () => this.stepFrame(1));

    [
      checkerPrevToggle,
      checkerNextToggle,
      checkerMaskToggle,
      checkerGridToggle,
      checkerBoundsToggle,
    ].forEach((control) => control.addEventListener("change", () => this.draw()));

    window.addEventListener("resize", () => this.resize());
    window.addEventListener("keydown", (event) => {
      if (!this.active) return;
      if (event.code === "Escape") {
        event.preventDefault();
        this.close();
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        this.stepFrame(1);
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        this.stepFrame(-1);
      }
    });
  }

  open() {
    this.active = true;
    frameCheckerElement.classList.remove("is-hidden");
    this.resize();
    this.refreshSource();
  }

  close() {
    this.active = false;
    frameCheckerElement.classList.add("is-hidden");
  }

  resize() {
    const rect = gameFrame.getBoundingClientRect();
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.canvas.width = Math.floor(this.width * ratio);
    this.canvas.height = Math.floor(this.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.draw();
  }

  async refreshSource() {
    this.item = null;
    checkerInfo.textContent = "Carregando fonte...";

    if (checkerSource.value === "beats") {
      this.item = await this.loadBeatItem();
    } else {
      this.item = this.loadGameplayItem();
    }

    const total = this.item?.totalFrames || 1;
    checkerFrame.max = String(Math.max(0, total - 1));
    checkerFrame.value = String(clamp(Number(checkerFrame.value) || 0, 0, total - 1));
    this.syncLabels();
  }

  loadGameplayItem() {
    const phase = checkerPhase.value || currentPhase;
    const state = checkerState.value || currentState;
    const animator = animators[phase]?.[state];

    if (!animator?.image) {
      return {
        image: null,
        rects: [],
        totalFrames: 1,
        columns: 1,
        rows: 1,
        label: "Sprites jogaveis: aguardando carregamento",
      };
    }

    return {
      image: animator.image,
      rects: animator.frameRects,
      boxes: animator.frameBoxes,
      totalFrames: animator.totalFrames,
      columns: animator.columns,
      rows: animator.rows,
      label: `${CONFIG.phases[phase].label} / ${state.toUpperCase()}`,
    };
  }

  async loadBeatItem() {
    const beatIndex = Number(checkerBeat.value) || 0;
    const sheetIndex = Number(checkerSheet.value) || 0;
    const beat = BEATS[beatIndex];
    const file = beat.files[sheetIndex];
    const path = `${beat.assetFolder}/${file}`;
    const image = await this.loadCachedImage(path);

    if (!image) {
      return {
        image: null,
        rects: [],
        totalFrames: 1,
        columns: 1,
        rows: 1,
        label: `${beat.title}: sheet nao carregada`,
      };
    }

    return {
      image,
      rects: this.buildRoundedRects(image, BEAT_FRAME.columns, BEAT_FRAME.rows, BEAT_FRAME.totalFrames),
      totalFrames: BEAT_FRAME.totalFrames,
      columns: BEAT_FRAME.columns,
      rows: BEAT_FRAME.rows,
      label: `${String(beatIndex + 1).padStart(2, "0")} ${beat.title} / ${file}`,
    };
  }

  async loadCachedImage(path) {
    if (this.imageCache.has(path)) return this.imageCache.get(path);
    const image = await loadBeatImage(path);
    this.imageCache.set(path, image);
    return image;
  }

  buildRoundedRects(image, columns, rows, totalFrames) {
    return Array.from({ length: totalFrames }, (_, frame) => {
      const col = frame % columns;
      const row = Math.floor(frame / columns);
      const x0 = Math.round((image.width * col) / columns);
      const x1 = Math.round((image.width * (col + 1)) / columns);
      const y0 = Math.round((image.height * row) / rows);
      const y1 = Math.round((image.height * (row + 1)) / rows);
      return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
    });
  }

  stepFrame(direction) {
    const total = this.item?.totalFrames || 1;
    const next = (Number(checkerFrame.value) + direction + total) % total;
    checkerFrame.value = String(next);
    this.syncLabels();
  }

  syncLabels() {
    const total = this.item?.totalFrames || 1;
    const frame = clamp(Number(checkerFrame.value) || 0, 0, total - 1);
    checkerFrame.value = String(frame);
    checkerFrameLabel.textContent = `${String(frame + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
    checkerScaleLabel.textContent = Number(checkerScale.value).toFixed(2);
    checkerPrevAlphaLabel.textContent = Number(checkerPrevAlpha.value).toFixed(2);
    checkerNextAlphaLabel.textContent = Number(checkerNextAlpha.value).toFixed(2);
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawCheckerBackground(ctx);

    if (!this.active && frameCheckerElement.classList.contains("is-hidden")) return;
    if (!this.item?.image) {
      this.drawEmpty(ctx);
      return;
    }

    const frame = clamp(Number(checkerFrame.value) || 0, 0, this.item.totalFrames - 1);
    const prev = (frame - 1 + this.item.totalFrames) % this.item.totalFrames;
    const next = (frame + 1) % this.item.totalFrames;
    const scale = Number(checkerScale.value) || 2;
    const rect = this.item.rects[frame];
    const viewWidth = this.width > 900 ? this.width - 330 : this.width;
    const centerX = Math.round(viewWidth * 0.5);
    const centerY = Math.round(this.height * 0.48);
    const dx = Math.round(centerX - (rect.w * scale) / 2);
    const dy = Math.round(centerY - (rect.h * scale) / 2);

    if (checkerGridToggle.checked) this.drawReviewGrid(ctx, centerX, centerY, rect, scale);
    if (checkerPrevToggle.checked) this.drawFrame(ctx, prev, centerX, centerY, scale, Number(checkerPrevAlpha.value), "#ff2a9d");
    if (checkerNextToggle.checked) this.drawFrame(ctx, next, centerX, centerY, scale, Number(checkerNextAlpha.value), "#00f0ff");
    if (checkerMaskToggle.checked) this.drawMask(ctx, frame, centerX, centerY, scale);
    this.drawFrame(ctx, frame, centerX, centerY, scale, 1, null);

    if (checkerBoundsToggle.checked) {
      drawBounds(ctx, dx, dy, rect.w * scale, rect.h * scale, CONFIG.palette.yellow);
      const box = this.frameBox(frame);
      drawBounds(ctx, dx + box.x * scale, dy + box.y * scale, box.w * scale, box.h * scale, CONFIG.palette.green);
    }

    this.drawHudText(ctx, frame, rect, scale);
    checkerInfo.textContent = `${this.item.label} | grid ${this.item.columns}x${this.item.rows} | frame ${frame + 1}`;
  }

  drawFrame(ctx, frame, centerX, centerY, scale, alpha, tint) {
    const rect = this.item.rects[frame];
    const dx = Math.round(centerX - (rect.w * scale) / 2);
    const dy = Math.round(centerY - (rect.h * scale) / 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.item.image, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w * scale, rect.h * scale);

    if (tint && alpha > 0) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.globalAlpha = Math.min(0.55, alpha * 0.8);
      ctx.fillStyle = tint;
      ctx.fillRect(dx, dy, rect.w * scale, rect.h * scale);
    }
    ctx.restore();
  }

  drawMask(ctx, frame, centerX, centerY, scale) {
    const rect = this.item.rects[frame];
    const dx = Math.round(centerX - (rect.w * scale) / 2);
    const dy = Math.round(centerY - (rect.h * scale) / 2);
    const mask = document.createElement("canvas");
    mask.width = rect.w;
    mask.height = rect.h;
    const maskCtx = mask.getContext("2d");
    maskCtx.imageSmoothingEnabled = false;
    maskCtx.drawImage(this.item.image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    maskCtx.globalCompositeOperation = "source-in";
    maskCtx.fillStyle = "rgba(44, 255, 143, 0.58)";
    maskCtx.fillRect(0, 0, rect.w, rect.h);

    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.shadowColor = CONFIG.palette.green;
    ctx.shadowBlur = 14;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mask, dx, dy, rect.w * scale, rect.h * scale);
    ctx.restore();
  }

  frameBox(frame) {
    if (this.item.boxes?.[frame]) return this.item.boxes[frame];
    if (!this.boxCache.has(this.item.image)) this.boxCache.set(this.item.image, new Map());
    const cache = this.boxCache.get(this.item.image);
    const key = `${this.item.label}:${frame}`;
    if (cache.has(key)) return cache.get(key);

    const rect = this.item.rects[frame];
    const temp = document.createElement("canvas");
    temp.width = rect.w;
    temp.height = rect.h;
    const tempCtx = temp.getContext("2d", { willReadFrequently: true });
    tempCtx.drawImage(this.item.image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    const pixels = tempCtx.getImageData(0, 0, rect.w, rect.h).data;
    let minX = rect.w;
    let minY = rect.h;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < rect.h; y += 1) {
      for (let x = 0; x < rect.w; x += 1) {
        if (pixels[(y * rect.w + x) * 4 + 3] <= 24) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    const box = maxX < minX
      ? { x: 0, y: 0, w: rect.w, h: rect.h }
      : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    cache.set(key, box);
    return box;
  }

  drawCheckerBackground(ctx) {
    ctx.fillStyle = "#070512";
    ctx.fillRect(0, 0, this.width, this.height);
    const size = 24;
    for (let y = 0; y < this.height; y += size) {
      for (let x = 0; x < this.width; x += size) {
        ctx.fillStyle = (x / size + y / size) % 2 ? "rgba(36, 18, 79, 0.22)" : "rgba(13, 10, 32, 0.28)";
        ctx.fillRect(x, y, size, size);
      }
    }
  }

  drawReviewGrid(ctx, centerX, centerY, rect, scale) {
    const w = rect.w * scale;
    const h = rect.h * scale;
    const x = Math.round(centerX - w / 2);
    const y = Math.round(centerY - h / 2);
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
    ctx.lineWidth = 1;
    for (let gx = x; gx <= x + w; gx += 16 * scale) {
      ctx.beginPath();
      ctx.moveTo(Math.round(gx), y);
      ctx.lineTo(Math.round(gx), y + h);
      ctx.stroke();
    }
    for (let gy = y; gy <= y + h; gy += 16 * scale) {
      ctx.beginPath();
      ctx.moveTo(x, Math.round(gy));
      ctx.lineTo(x + w, Math.round(gy));
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 42, 157, 0.8)";
    ctx.beginPath();
    ctx.moveTo(centerX - 22, centerY);
    ctx.lineTo(centerX + 22, centerY);
    ctx.moveTo(centerX, centerY - 22);
    ctx.lineTo(centerX, centerY + 22);
    ctx.stroke();
    ctx.restore();
  }

  drawHudText(ctx, frame, rect, scale) {
    ctx.save();
    ctx.fillStyle = "rgba(7, 5, 18, 0.72)";
    ctx.fillRect(16, this.height - 54, Math.min(690, this.width - 32), 36);
    ctx.fillStyle = CONFIG.palette.white;
    ctx.font = "11px 'Lucida Console', monospace";
    ctx.fillText(`${this.item.label}`, 28, this.height - 35);
    ctx.fillStyle = CONFIG.palette.cyan;
    ctx.fillText(`frame ${frame + 1}/${this.item.totalFrames} | cell ${rect.w}x${rect.h} | escala ${Number(checkerScale.value).toFixed(2)}x`, 28, this.height - 20);
    ctx.restore();
  }

  drawEmpty(ctx) {
    ctx.save();
    ctx.fillStyle = CONFIG.palette.yellow;
    ctx.font = "14px 'Lucida Console', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Frame Checker aguardando assets", this.width * 0.5, this.height * 0.5);
    ctx.restore();
  }
}

const textBox = new TextBox();

function loadBeatImage(file) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = file;
  });
}

function playBeatAmbience(beatId) {
  stopBeatAmbience();
  for (const cue of AUDIO_CUES[beatId] || []) triggerCue(cue);
}

function stopBeatAmbience() {
  // Placeholder para futuras trilhas em loop.
}

function triggerCue(cueName) {
  const audio = new Audio(`assets/audio/${cueName}.mp3`);
  audio.volume = 0.28;
  audio.play().catch(() => {});
}

function setupCinematicIntro() {
  cinematicIntro = new CinematicIntro();
  cinematicIntro.init();
}

function setupFrameChecker() {
  frameChecker = new FrameChecker();
  frameChecker.init();
}

function handleKeyDown(event) {
  if (frameChecker?.active) return;

  if (cinematicIntro?.handleShortcut(event)) {
    event.preventDefault();
    return;
  }

  if (event.code === "KeyU") {
    event.preventDefault();
    toggleGameUi();
    return;
  }

  if (event.repeat) return;
  unlockAudio();
  pressed.add(event.code);

  if (event.code === "Space") {
    event.preventDefault();
    triggerAction("jump");
  } else if (event.code === "KeyJ") {
    triggerAction("attack");
  } else if (event.code === "KeyS") {
    triggerAction("down");
  } else if (event.code === "KeyW") {
    triggerAction("getting_up", "up");
  } else if (event.code === "KeyK") {
    triggerAction("licking_fur", "purr");
  } else if (event.code === "KeyL") {
    triggerVoice();
  } else if (event.code === "Digit1" || event.code === "Numpad1") {
    jumpToPhase("filhote");
  } else if (event.code === "Digit2" || event.code === "Numpad2") {
    jumpToPhase("adulto");
  } else if (event.code === "Digit3" || event.code === "Numpad3") {
    jumpToPhase("idoso");
  }
}

function handleKeyUp(event) {
  pressed.delete(event.code);
}

function setupUi() {
  for (const state of STATES) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state.toUpperCase();
    debugState.appendChild(option);
  }

  for (const phase of PHASES) {
    const option = document.createElement("option");
    option.value = phase;
    option.textContent = CONFIG.phases[phase].label;
    debugPhase.appendChild(option);
  }

  CONFIG.stages.forEach((stage, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = stage.label;
    stageSelect.appendChild(option);
  });

  populateSoundtrackSelect(soundtrackSelect);
  populateSoundtrackSelect(beatSoundtrackSelect);

  document.querySelectorAll("[data-phase]").forEach((button) => {
    button.addEventListener("click", () => {
      unlockAudio();
      jumpToPhase(button.dataset.phase);
    });
  });

  document.querySelectorAll("[data-control]").forEach((button) => {
    setupActionButton(button);
  });

  document.querySelectorAll("[data-haptic]").forEach((button) => {
    button.addEventListener("click", () => {
      unlockAudio();
      previewHapticEffect(button.dataset.haptic, button);
    });
  });

  debugState.addEventListener("change", () => {
    manualDebug = true;
    setState(debugState.value, true);
  });

  debugPhase.addEventListener("change", () => jumpToPhase(debugPhase.value));
  stageSelect.addEventListener("change", () => {
    unlockAudio();
    setStage(stageSelect.value);
  });

  soundtrackSelect.addEventListener("change", () => {
    unlockAudio();
    setSoundtrack(soundtrackSelect.value);
  });

  beatSoundtrackSelect.addEventListener("change", () => {
    unlockAudio();
    setSoundtrack(beatSoundtrackSelect.value);
  });

  fpsSlider.addEventListener("input", () => {
    const animator = activeAnimator();
    if (!animator) return;
    animator.setFps(Number(fpsSlider.value));
    fpsValue.textContent = String(animator.fps);
  });

  scaleSlider.addEventListener("input", () => {
    scaleValue.textContent = Number(scaleSlider.value).toFixed(2);
  });

  nextFrameButton.addEventListener("click", () => {
    manualDebug = true;
    activeAnimator()?.nextFrame();
  });

  openCinematicButton.addEventListener("click", () => {
    unlockAudio();
    cinematicIntro?.open();
  });
  fullscreenButton.addEventListener("click", toggleFullscreen);
  gameUiToggle.addEventListener("click", toggleGameUi);
  hapticsToggle.addEventListener("click", openHapticsPanel);
  hapticsClose.addEventListener("click", closeHapticsPanel);
  hapticsStrength.addEventListener("input", () => {
    hapticsStrengthValue.textContent = Number(hapticsStrength.value).toFixed(2);
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      if (!hapticsPanel.classList.contains("is-hidden")) closeHapticsPanel();
      manualDebug = false;
      pauseCheck.checked = false;
      setState("idle", true);
    }
  });
}

function toggleGameUi() {
  gameUiVisible = !gameUiVisible;
  hud.classList.toggle("ui-hidden", !gameUiVisible);
  gameUiToggle.textContent = gameUiVisible ? "UI" : "UI OFF";
  gameUiToggle.setAttribute("aria-pressed", String(!gameUiVisible));
}

function openHapticsPanel() {
  unlockAudio();
  lastHapticStatus = "";
  hapticsPanel.classList.remove("is-hidden");
  updateHapticDeviceStatus();
  playHapticEffect("phase");
}

function closeHapticsPanel() {
  hapticsPanel.classList.add("is-hidden");
}

function previewHapticEffect(name, button) {
  const visualStateByEffect = {
    jump: "jump",
    purr: "licking_fur",
    voice: currentState,
    attack: "attack",
    down: "down",
    care: "licking_fur",
    up: "getting_up",
    phase: currentState,
  };

  const visualState = visualStateByEffect[name];
  if (visualState && STATES.includes(visualState)) setState(visualState, true);
  if (name === "voice") triggerVoice();
  else {
    playActionSound(name);
    playHapticEffect(name);
  }

  button.classList.add("is-active");
  window.setTimeout(() => button.classList.remove("is-active"), 280);
}

function toggleFullscreen() {
  unlockAudio();
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }
  gameShell.requestFullscreen?.();
}

function syncFullscreenButton() {
  fullscreenButton.textContent = document.fullscreenElement ? "SAIR" : "TELA CHEIA";
  window.setTimeout(resizeCanvas, 60);
}

function setupActionButton(button) {
  const control = button.dataset.control;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    unlockAudio();
    button.setPointerCapture(event.pointerId);
    button.classList.add("is-active");

    if (control === "body") {
      bodyHeld = false;
      bodyHoldTimer = window.setTimeout(() => {
        bodyHeld = true;
        touchRun = true;
      }, 230);
      return;
    }

    activateControl(control);
  });

  button.addEventListener("pointerup", (event) => {
    event.preventDefault();
    button.classList.remove("is-active");

    if (control !== "body") return;
    window.clearTimeout(bodyHoldTimer);
    touchRun = false;
    if (!bodyHeld) triggerAction("jump");
  });

  button.addEventListener("pointercancel", () => {
    button.classList.remove("is-active");
    window.clearTimeout(bodyHoldTimer);
    touchRun = false;
  });
}

function activateControl(control) {
  unlockAudio();
  if (control === "voice") triggerVoice();
  if (control === "care") triggerAction("licking_fur", "purr");
  if (control === "down") triggerAction("down");
  if (control === "up") triggerAction("getting_up", "up");
}

function setupJoystick() {
  joystick.addEventListener("pointerdown", (event) => {
    unlockAudio();
    joystickState.active = true;
    joystickState.id = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });

  joystick.addEventListener("pointermove", (event) => {
    if (joystickState.active && joystickState.id === event.pointerId) updateJoystick(event);
  });

  const release = () => {
    joystickState.active = false;
    joystickState.id = null;
    joystickState.x = 0;
    joystickState.y = 0;
    joystickKnob.style.transform = "translate(0px, 0px)";
  };

  joystick.addEventListener("pointerup", release);
  joystick.addEventListener("pointercancel", release);
}

function setupGamepadListeners() {
  window.addEventListener("gamepadconnected", (event) => {
    activeGamepadIndex = event.gamepad.index;
    previousGamepadButtons.set(event.gamepad.index, event.gamepad.buttons.map(() => false));
    gamepadLabel.textContent = event.gamepad.id.includes("DualSense") ? "DUALSENSE" : event.gamepad.id.slice(0, 18).toUpperCase();
  });

  window.addEventListener("gamepaddisconnected", (event) => {
    previousGamepadButtons.delete(event.gamepad.index);
    if (activeGamepadIndex === event.gamepad.index) {
      activeGamepadIndex = null;
      gamepadAxisX = 0;
      gamepadRun = false;
      gamepadLabel.textContent = "TECLADO/TOQUE";
    }
  });
}

function updateJoystick(event) {
  const rect = joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const max = rect.width * 0.34;
  const dx = event.clientX - cx;
  const dy = event.clientY - cy;
  const length = Math.hypot(dx, dy) || 1;
  const clamped = Math.min(max, length);
  const nx = (dx / length) * clamped;
  const ny = (dy / length) * clamped;

  joystickState.x = nx / max;
  joystickState.y = ny / max;
  joystickKnob.style.transform = `translate(${nx}px, ${ny}px)`;
}

function loop(now) {
  const deltaTime = Math.min(0.05, (now - lastTime) / 1000 || 0);
  lastTime = now;
  update(deltaTime, now);
  draw(now);
  requestAnimationFrame(loop);
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function start() {
  resizeCanvas();
  setupUi();
  setupJoystick();
  setupGamepadListeners();
  setupCinematicIntro();
  setupFrameChecker();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => pressed.clear());
  loadAssets();
  requestAnimationFrame((now) => {
    lastTime = now;
    requestAnimationFrame(loop);
  });
}

start();
