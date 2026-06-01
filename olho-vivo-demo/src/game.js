const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const bootCard = document.querySelector("#bootCard");
const startButton = document.querySelector("#startButton");
const padStatus = document.querySelector("#padStatus");

const W = canvas.width;
const H = canvas.height;
const CENTER = { x: W * 0.5, y: H * 0.56 };
const WORLD = { w: 3600, h: H };
const PLAYER_START = { x: WORLD.w * 0.5, y: H * 0.56 };
const TAU = Math.PI * 2;

const ASSETS = {
  eye: "./assets/png/transparent/eye.png",
  car: "./assets/png/transparent/enemy-car.png",
  news: "./assets/png/transparent/enemy-news.png",
  cart: "./assets/png/transparent/enemy-cart.png",
  notification: "./assets/png/transparent/enemy-notification.png",
  bill: "./assets/png/transparent/enemy-bill.png",
  folder: "./assets/png/transparent/enemy-folder.png",
  stamp: "./assets/png/transparent/enemy-stamp.png",
  burnout: "./assets/png/transparent/enemy-burnout.png",
  sugar: "./assets/png/transparent/sugar.png",
  xp: "./assets/png/transparent/xp.png",
  prism: "./assets/png/transparent/prism-drop.png",
  projectilePrism: "./assets/png/transparent/projectile-prism.png",
  projectileLeaf: "./assets/png/transparent/projectile-leaf.png",
  eyeSheet: "./assets/sheets/transparent/eye-idle-sheet.png",
  sugarSheet: "./assets/sheets/transparent/sugar-pulse-sheet.png",
  newsSheet: "./assets/sheets/transparent/enemy-news-scream-sheet.png",
  cartSheet: "./assets/sheets/transparent/enemy-cart-bite-sheet.png",
  eyeDamageSheet: "./assets/states/transparent/eye-damage-sheet.png",
  eyeEvolveSheet: "./assets/states/transparent/eye-evolve-sheet.png",
  eyeDeathSheet: "./assets/states/transparent/eye-death-sheet.png",
  notificationSheet: "./assets/states/transparent/enemy-notification-pulse-sheet.png",
  billSheet: "./assets/states/transparent/enemy-bill-flap-sheet.png",
  stageNoise: "./assets/backgrounds/runtime/stage-noise.png",
  stageMarket: "./assets/backgrounds/runtime/stage-market.png",
  stageGarden: "./assets/backgrounds/runtime/stage-garden.png",
};

const ENEMY_TYPES = [
  { key: "car", hp: 2.2, speed: 48, radius: 17, size: 50, color: "#ff7a2f", xp: 3 },
  { key: "news", hp: 1.7, speed: 58, radius: 15, size: 47, color: "#f2eadc", xp: 2 },
  { key: "cart", hp: 3.1, speed: 43, radius: 18, size: 52, color: "#d9e4ee", xp: 4 },
  { key: "notification", hp: 1.2, speed: 82, radius: 13, size: 41, color: "#ff4f9d", xp: 2 },
  { key: "bill", hp: 1.8, speed: 52, radius: 14, size: 42, color: "#d7f2c6", xp: 3 },
  { key: "folder", hp: 2.5, speed: 38, radius: 17, size: 50, color: "#f7c85a", xp: 4 },
  { key: "stamp", hp: 3.6, speed: 36, radius: 20, size: 56, color: "#c88342", xp: 5 },
  { key: "burnout", hp: 2.8, speed: 30, radius: 23, size: 62, color: "#b666ff", xp: 5 },
];

const STAGES = [
  {
    key: "stageNoise",
    name: "Avenida do Ruido",
    tint: "#ff4fd8",
    obstacles: [
      { x: 360, y: 185, rx: 130, ry: 42, label: "engarrafamento" },
      { x: 820, y: 560, rx: 112, ry: 46, label: "banca" },
      { x: 1370, y: 170, rx: 86, ry: 42, label: "ponto" },
      { x: 2100, y: 585, rx: 122, ry: 44, label: "placas" },
      { x: 2760, y: 170, rx: 136, ry: 48, label: "carros" },
      { x: 3260, y: 550, rx: 104, ry: 42, label: "cone" },
    ],
  },
  {
    key: "stageMarket",
    name: "Mercado do Desejo",
    tint: "#ffe96a",
    obstacles: [
      { x: 440, y: 160, rx: 118, ry: 48, label: "vitrine" },
      { x: 740, y: 584, rx: 108, ry: 44, label: "caixa" },
      { x: 1320, y: 178, rx: 122, ry: 50, label: "cristais" },
      { x: 1870, y: 575, rx: 124, ry: 46, label: "carrinhos" },
      { x: 2520, y: 166, rx: 116, ry: 42, label: "display" },
      { x: 3170, y: 560, rx: 132, ry: 48, label: "altar" },
    ],
  },
  {
    key: "stageGarden",
    name: "Jardim de Cura Urbana",
    tint: "#78ff5d",
    obstacles: [
      { x: 420, y: 170, rx: 112, ry: 46, label: "raizes" },
      { x: 780, y: 568, rx: 126, ry: 42, label: "fonte" },
      { x: 1450, y: 176, rx: 118, ry: 44, label: "cogumelos" },
      { x: 2050, y: 580, rx: 138, ry: 50, label: "tronco" },
      { x: 2700, y: 162, rx: 116, ry: 44, label: "guardiao" },
      { x: 3240, y: 560, rx: 120, ry: 46, label: "mural" },
    ],
  },
];

const bgStars = Array.from({ length: 280 }, (_, i) => ({
  x: (i * 197 + 41) % WORLD.w,
  y: (i * 113 + 83) % H,
  r: 0.6 + ((i * 7) % 17) / 18,
  a: 0.05 + ((i * 11) % 15) / 120,
  c: ["#ff4fd8", "#62f9ff", "#78ff5d", "#ffe96a"][i % 4],
}));

const bgDecals = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 241 + 60) % WORLD.w,
  y: (i * 137 + 90) % H,
  r: 16 + (i % 5) * 9,
  rot: i * 0.67,
}));

const images = {};
const keys = new Set();
let pointerId = null;
let pointerOrigin = null;
let pointerVector = { x: 0, y: 0 };
let running = false;
let lastTime = performance.now();
let padDashQueued = false;
let audioCtx = null;

const game = {
  time: 390,
  level: 12,
  focus: 0.72,
  clarity: 0.63,
  sugar: 1,
  sugarTimer: 7.5,
  flash: 0,
  damagePulse: 0,
  eyeState: "idle",
  eyeStateTimer: 0,
  shake: 0,
  cameraX: PLAYER_START.x - W * 0.5,
  stageIndex: 0,
  spawn: 0,
  crystalSpawn: 0,
  pulse: 0,
  shot: 0,
  leafShot: 0,
  ambientTimer: 3.5,
  enemyId: 0,
  player: {
    x: PLAYER_START.x,
    y: PLAYER_START.y,
    vx: 0,
    vy: 0,
    radius: 17,
    invuln: 0,
  },
  enemies: [],
  bullets: [],
  xp: [],
  sugars: [],
  particles: [],
  damageTexts: [],
};

function loadImages() {
  return Promise.all(
    Object.entries(ASSETS).map(
      ([key, src]) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            images[key] = img;
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        }),
    ),
  );
}

function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = new AudioContext();
}

function tone(freq, duration = 0.12, type = "sine", gain = 0.045, slideTo = null) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.04);
}

function noise(duration = 0.12, gain = 0.04) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const length = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = audioCtx.createBufferSource();
  const amp = audioCtx.createGain();
  source.buffer = buffer;
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(amp);
  amp.connect(audioCtx.destination);
  source.start(now);
}

function sfx(kind) {
  if (!audioCtx) return;
  if (kind === "xp") tone(740 + Math.random() * 80, 0.08, "triangle", 0.026, 1180);
  if (kind === "sugar") {
    tone(620, 0.16, "sine", 0.04, 1240);
    setTimeout(() => tone(1480, 0.11, "triangle", 0.025), 45);
  }
  if (kind === "damage") {
    noise(0.18, 0.09);
    tone(92, 0.2, "sawtooth", 0.045, 48);
  }
  if (kind === "dash") tone(220, 0.12, "triangle", 0.035, 720);
  if (kind === "level") {
    tone(520, 0.13, "sine", 0.032, 780);
    setTimeout(() => tone(980, 0.16, "sine", 0.03, 1320), 80);
  }
  if (kind === "ambient") {
    tone(420 + Math.random() * 220, 0.18, "sine", 0.009, 780 + Math.random() * 420);
  }
}

function setEyeState(state, duration) {
  game.eyeState = state;
  game.eyeStateTimer = duration;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function len(x, y) {
  return Math.hypot(x, y) || 1;
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function activeStage() {
  return STAGES[game.stageIndex];
}

function cameraTargetX() {
  return clamp(game.player.x - W * 0.5, 0, WORLD.w - W);
}

function worldToScreenX(x) {
  return x - game.cameraX;
}

function drawSprite(img, x, y, maxSize, rotation = 0) {
  const ratio = img.width / img.height;
  const w = ratio >= 1 ? maxSize : maxSize * ratio;
  const h = ratio >= 1 ? maxSize / ratio : maxSize;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function drawSheetFrame(img, frame, x, y, maxSize, rotation = 0) {
  const cols = 4;
  const rows = 4;
  const fw = img.width / cols;
  const fh = img.height / rows;
  const index = frame % 16;
  const sx = (index % cols) * fw;
  const sy = Math.floor(index / cols) * fh;
  const ratio = fw / fh;
  const w = ratio >= 1 ? maxSize : maxSize * ratio;
  const h = ratio >= 1 ? maxSize / ratio : maxSize;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(img, sx, sy, fw, fh, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function spawnEnemy(crystal = false) {
  const side = Math.floor(rand(0, 4));
  const pad = 70;
  const left = game.cameraX;
  const right = game.cameraX + W;
  const pos = [
    { x: clamp(rand(left - pad, right + pad), -pad, WORLD.w + pad), y: -pad },
    { x: clamp(right + pad, -pad, WORLD.w + pad), y: rand(-pad, H + pad) },
    { x: clamp(rand(left - pad, right + pad), -pad, WORLD.w + pad), y: H + pad },
    { x: clamp(left - pad, -pad, WORLD.w + pad), y: rand(-pad, H + pad) },
  ][side];
  const type = ENEMY_TYPES[Math.floor(rand(0, ENEMY_TYPES.length))];
  const elite = crystal || Math.random() < 0.09;
  game.enemies.push({
    id: game.enemyId++,
    type,
    x: pos.x,
    y: pos.y,
    hp: type.hp * (elite ? 2.5 : 1),
    maxHp: type.hp * (elite ? 2.5 : 1),
    speed: type.speed * rand(0.9, 1.14) * (elite ? 0.82 : 1),
    radius: type.radius * (elite ? 1.28 : 1),
    size: type.size * (elite ? 1.36 : 1),
    rot: rand(0, TAU),
    drift: rand(-1, 1),
    crystal: elite,
    hit: 0,
  });
}

function spawnEnemyAt(x, y, crystal = false) {
  const type = ENEMY_TYPES[Math.floor(rand(0, ENEMY_TYPES.length))];
  const elite = crystal || Math.random() < 0.08;
  game.enemies.push({
    id: game.enemyId++,
    type,
    x,
    y,
    hp: type.hp * (elite ? 2.5 : 1),
    maxHp: type.hp * (elite ? 2.5 : 1),
    speed: type.speed * rand(0.9, 1.14) * (elite ? 0.82 : 1),
    radius: type.radius * (elite ? 1.28 : 1),
    size: type.size * (elite ? 1.36 : 1),
    rot: angleTo({ x, y }, game.player),
    drift: rand(-1, 1),
    crystal: elite,
    hit: 0,
  });
}

function seedMinuteSixState() {
  game.enemies.length = 0;
  game.bullets.length = 0;
  game.xp.length = 0;
  game.sugars.length = 0;
  game.particles.length = 0;
  game.damageTexts.length = 0;

  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU + rand(-0.18, 0.18);
    const ring = i % 3 === 0 ? rand(270, 345) : rand(390, 610);
    const x = clamp(game.player.x + Math.cos(a) * ring, 40, WORLD.w - 40);
    const y = clamp(game.player.y + Math.sin(a) * ring * 0.78, 76, H - 46);
    const tooClose = Math.hypot(x - game.player.x, y - game.player.y) < 185;
    spawnEnemyAt(
      tooClose ? game.player.x + Math.cos(a) * 230 : x,
      tooClose ? game.player.y + Math.sin(a) * 170 : y,
      i % 12 === 0,
    );
  }

  for (let i = 0; i < 34; i++) {
    const a = rand(0, TAU);
    const r = rand(120, 430);
    dropXp(
      clamp(game.player.x + Math.cos(a) * r, 80, WORLD.w - 80),
      clamp(game.player.y + Math.sin(a) * r * 0.74, 92, H - 80),
      1,
      i % 11 === 0,
    );
  }

  dropSugar(game.player.x + 190, H * 0.48);
  burst(game.player.x, game.player.y, "#ff4fd8", 28, 150);
}

function dropXp(x, y, amount, rare = false) {
  for (let i = 0; i < amount; i++) {
    game.xp.push({
      x: x + rand(-14, 14),
      y: y + rand(-14, 14),
      vx: rand(-35, 35),
      vy: rand(-35, 35),
      radius: rare ? 8 : 5,
      value: rare ? 0.045 : 0.012,
      rare,
      life: 16,
    });
  }
}

function dropSugar(x, y) {
  game.sugars.push({
    x: x + rand(-10, 10),
    y: y + rand(-10, 10),
    radius: 11,
    pulse: rand(0, TAU),
  });
}

function resolvePlayerObstacles() {
  for (const obstacle of activeStage().obstacles) {
    const dx = game.player.x - obstacle.x;
    const dy = game.player.y - obstacle.y;
    const rx = obstacle.rx + game.player.radius;
    const ry = obstacle.ry + game.player.radius;
    const nx = dx / rx;
    const ny = dy / ry;
    const inside = nx * nx + ny * ny;
    if (inside > 0 && inside < 1) {
      const angle = Math.atan2(ny, nx);
      const targetX = Math.cos(angle) * rx;
      const targetY = Math.sin(angle) * ry;
      game.player.x = obstacle.x + targetX;
      game.player.y = obstacle.y + targetY;
      game.player.vx *= 0.32;
      game.player.vy *= 0.32;
      if (game.player.invuln <= 0.05) {
        burst(game.player.x, game.player.y, activeStage().tint, 3, 45);
      }
    }
  }
}

function burst(x, y, color, count = 10, power = 120) {
  for (let i = 0; i < count; i++) {
    const a = rand(0, TAU);
    const v = rand(power * 0.35, power);
    game.particles.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: rand(0.35, 0.9),
      maxLife: rand(0.35, 0.9),
      size: rand(1.3, 4.4),
      color,
    });
  }
}

function fireAtNearest(kind = "prism") {
  if (!game.enemies.length) return;
  let target = game.enemies[0];
  let best = Infinity;
  for (const enemy of game.enemies) {
    const d = dist(game.player, enemy);
    if (d < best) {
      best = d;
      target = enemy;
    }
  }
  const a = angleTo(game.player, target) + rand(-0.06, 0.06);
  const speed = kind === "leaf" ? 360 : 430;
  game.bullets.push({
    x: game.player.x,
    y: game.player.y,
    vx: Math.cos(a) * speed,
    vy: Math.sin(a) * speed,
    radius: kind === "leaf" ? 8 : 7,
    damage: kind === "leaf" ? 0.85 : 1.15,
    life: kind === "leaf" ? 1.15 : 1.45,
    kind,
    color: kind === "leaf" ? "#78ff5d" : "#ff4fd8",
    trail: [],
  });
}

function readInput() {
  let x = 0;
  let y = 0;
  padDashQueued = false;

  if (keys.has("arrowleft") || keys.has("a")) x -= 1;
  if (keys.has("arrowright") || keys.has("d")) x += 1;
  if (keys.has("arrowup") || keys.has("w")) y -= 1;
  if (keys.has("arrowdown") || keys.has("s")) y += 1;

  x += pointerVector.x;
  y += pointerVector.y;

  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let connected = false;
  for (const pad of pads) {
    if (!pad) continue;
    connected = true;
    const ax = Math.abs(pad.axes[0]) > 0.13 ? pad.axes[0] : 0;
    const ay = Math.abs(pad.axes[1]) > 0.13 ? pad.axes[1] : 0;
    x += ax;
    y += ay;
    if (pad.buttons[14]?.pressed) x -= 1;
    if (pad.buttons[15]?.pressed) x += 1;
    if (pad.buttons[12]?.pressed) y -= 1;
    if (pad.buttons[13]?.pressed) y += 1;
    padDashQueued = Boolean(pad.buttons[0]?.pressed || pad.buttons[1]?.pressed);
    break;
  }
  padStatus.textContent = connected ? "controle: conectado" : "controle: procurando";

  const l = len(x, y);
  return l > 1 ? { x: x / l, y: y / l } : { x, y };
}

let dashCooldown = 0;

function dash(inputOverride = null) {
  if (dashCooldown > 0) return;
  const input = inputOverride || readInput();
  if (Math.abs(input.x) + Math.abs(input.y) < 0.1) return;
  game.player.x += input.x * 86;
  game.player.y += input.y * 86;
  game.player.invuln = Math.max(game.player.invuln, 0.32);
  game.shake = Math.max(game.shake, 4);
  dashCooldown = 0.85;
  sfx("dash");
  burst(game.player.x, game.player.y, "#62f9ff", 18, 180);
}

function update(dt) {
  game.time += dt;
  game.flash = Math.max(0, game.flash - dt * 1.6);
  game.damagePulse = Math.max(0, game.damagePulse - dt * 2.2);
  if (game.eyeStateTimer > 0) {
    game.eyeStateTimer = Math.max(0, game.eyeStateTimer - dt);
    if (game.eyeStateTimer === 0) game.eyeState = "idle";
  }
  game.shake = Math.max(0, game.shake - dt * 12);
  game.player.invuln = Math.max(0, game.player.invuln - dt);
  dashCooldown = Math.max(0, dashCooldown - dt);

  if (game.sugarTimer > 0) {
    game.sugarTimer = Math.max(0, game.sugarTimer - dt);
    if (game.sugarTimer === 0 && game.sugar > 0) game.sugar = Math.max(0, game.sugar - 1);
  }
  game.ambientTimer -= dt;
  if (game.ambientTimer <= 0) {
    sfx("ambient");
    game.ambientTimer = rand(4.2, 8.5);
  }

  const input = readInput();
  if (padDashQueued) dash(input);
  const speedBoost = game.sugar > 0 ? 1.18 : 1;
  const speed = 208 * speedBoost;
  game.player.vx += (input.x * speed - game.player.vx) * Math.min(1, dt * 12);
  game.player.vy += (input.y * speed - game.player.vy) * Math.min(1, dt * 12);
  game.player.x = clamp(game.player.x + game.player.vx * dt, 42, WORLD.w - 42);
  game.player.y = clamp(game.player.y + game.player.vy * dt, 72, H - 48);
  resolvePlayerObstacles();
  game.cameraX += (cameraTargetX() - game.cameraX) * Math.min(1, dt * 8);

  game.spawn -= dt;
  if (game.spawn <= 0 && game.enemies.length < 58) {
    const count = game.enemies.length < 35 ? 4 : 2;
    for (let i = 0; i < count; i++) spawnEnemy(false);
    game.spawn = rand(0.62, 1.05);
  }

  game.crystalSpawn -= dt;
  if (game.crystalSpawn <= 0) {
    spawnEnemy(true);
    game.crystalSpawn = rand(5.2, 8.8);
  }

  game.shot -= dt;
  if (game.shot <= 0) {
    fireAtNearest("prism");
    if (game.sugar > 0) setTimeout(() => fireAtNearest("prism"), 70);
    game.shot = game.sugar > 0 ? 0.34 : 0.48;
  }

  game.leafShot -= dt;
  if (game.leafShot <= 0) {
    fireAtNearest("leaf");
    game.leafShot = 0.92;
  }

  game.pulse -= dt;
  if (game.pulse <= 0) {
    game.pulse = 2.8;
    game.damageTexts.push({ x: game.player.x, y: game.player.y, r: 10, life: 0.8, color: "#ff7ade" });
    for (const enemy of game.enemies) {
      const d = dist(game.player, enemy);
      if (d < 118) {
        enemy.hp -= 0.75;
        enemy.hit = 0.12;
      }
    }
  }

  updateEnemies(dt);
  updateBullets(dt);
  updateDrops(dt);
  updateParticles(dt);
  cleanup();
}

function updateEnemies(dt) {
  const shieldRadius = 70 + Math.sin(game.time * 4) * 3;
  for (const enemy of game.enemies) {
    const a = angleTo(enemy, game.player) + Math.sin(game.time * 1.2 + enemy.id) * 0.16 * enemy.drift;
    enemy.x += Math.cos(a) * enemy.speed * dt;
    enemy.y += Math.sin(a) * enemy.speed * dt;
    enemy.rot = a;
    enemy.hit = Math.max(0, enemy.hit - dt);

    const d = dist(enemy, game.player);
    if (d < enemy.radius + shieldRadius * 0.42) {
      enemy.hp -= 0.72 * dt;
      const push = (enemy.radius + shieldRadius * 0.42 - d) * 0.7;
      enemy.x -= Math.cos(a) * push;
      enemy.y -= Math.sin(a) * push;
      if (Math.random() < 0.08) burst(enemy.x, enemy.y, "#ffe96a", 1, 40);
    }

    if (d < enemy.radius + game.player.radius && game.player.invuln <= 0) {
      game.focus = Math.max(0, game.focus - 0.075);
      game.player.invuln = 0.7;
      game.flash = 0.38;
      game.damagePulse = 1;
      game.shake = 18;
      setEyeState("damage", 0.58);
      sfx("damage");
      burst(game.player.x, game.player.y, "#ff4f57", 20, 190);
      if (game.focus <= 0) resetRun();
    }
  }
}

function updateBullets(dt) {
  for (const bullet of game.bullets) {
    bullet.trail.push({ x: bullet.x, y: bullet.y });
    if (bullet.trail.length > 7) bullet.trail.shift();
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    for (const enemy of game.enemies) {
      if (enemy.hp <= 0) continue;
      if (Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < enemy.radius + bullet.radius) {
        enemy.hp -= bullet.damage * (game.sugar > 0 ? 1.55 : 1);
        enemy.hit = 0.16;
        bullet.life = -1;
        burst(bullet.x, bullet.y, bullet.color, 5, 90);
        break;
      }
    }
  }
}

function updateDrops(dt) {
  for (const shard of game.xp) {
    shard.life -= dt;
    shard.x += shard.vx * dt;
    shard.y += shard.vy * dt;
    shard.vx *= 1 - dt * 2.2;
    shard.vy *= 1 - dt * 2.2;
    const d = dist(shard, game.player);
    const magnet = game.sugar > 0 ? 126 : 86;
    if (d < magnet) {
      const a = angleTo(shard, game.player);
      shard.vx += Math.cos(a) * 680 * dt;
      shard.vy += Math.sin(a) * 680 * dt;
    }
    if (d < shard.radius + game.player.radius + 2) {
      game.clarity += shard.value;
      shard.life = -1;
      sfx(shard.rare ? "sugar" : "xp");
      burst(shard.x, shard.y, shard.rare ? "#ff4fd8" : "#62f9ff", shard.rare ? 8 : 3, 80);
      if (game.clarity >= 1) {
        game.level += 1;
        game.clarity = game.clarity % 1;
        game.focus = Math.min(1, game.focus + 0.08);
        game.flash = 0.26;
        setEyeState("evolve", 1.25);
        sfx("level");
        game.damageTexts.push({ x: game.player.x, y: game.player.y, r: 20, life: 1.25, color: "#78ff5d" });
      }
    }
  }

  for (const sugar of game.sugars) {
    sugar.pulse += dt * 5;
    if (dist(sugar, game.player) < sugar.radius + game.player.radius + 1) {
      game.sugar += 1;
      game.sugarTimer = 9;
      sugar.dead = true;
      game.flash = 0.5;
      game.shake = 11;
      sfx("sugar");
      burst(sugar.x, sugar.y, "#fff6ff", 34, 260);
      if (game.sugar >= 3) sugarCrash();
    }
  }
}

function updateParticles(dt) {
  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 1 - dt * 1.8;
    p.vy *= 1 - dt * 1.8;
    p.life -= dt;
  }
  for (const t of game.damageTexts) {
    t.life -= dt;
    t.r += dt * 160;
  }
}

function cleanup() {
  for (let i = game.enemies.length - 1; i >= 0; i--) {
    const enemy = game.enemies[i];
    if (enemy.hp <= 0) {
      dropXp(enemy.x, enemy.y, enemy.type.xp + (enemy.crystal ? 4 : 0), enemy.crystal);
      if (enemy.crystal && Math.random() < 0.72) dropSugar(enemy.x, enemy.y);
      burst(enemy.x, enemy.y, enemy.crystal ? "#fff6ff" : enemy.type.color, enemy.crystal ? 20 : 9, 145);
      game.enemies.splice(i, 1);
    }
  }
  game.bullets = game.bullets.filter((b) => b.life > 0 && b.x > -80 && b.x < WORLD.w + 80 && b.y > -80 && b.y < H + 80);
  game.xp = game.xp.filter((x) => x.life > 0);
  game.sugars = game.sugars.filter((s) => !s.dead);
  game.particles = game.particles.filter((p) => p.life > 0);
  game.damageTexts = game.damageTexts.filter((t) => t.life > 0);
}

function sugarCrash() {
  game.sugar = 0;
  game.sugarTimer = 0;
  game.focus = 0.72;
  game.player.x = PLAYER_START.x;
  game.player.y = PLAYER_START.y;
  game.player.invuln = 1.4;
  game.enemies.length = Math.min(game.enemies.length, 22);
  game.sugars.length = 0;
  game.flash = 1;
  game.shake = 20;
  game.damagePulse = 1;
  setEyeState("death", 1.1);
  sfx("damage");
  game.cameraX = cameraTargetX();
  burst(game.player.x, game.player.y, "#ffffff", 90, 360);
}

function resetRun() {
  game.focus = 0.72;
  game.clarity = 0.63;
  game.sugar = 1;
  game.sugarTimer = 7.5;
  game.player.x = PLAYER_START.x;
  game.player.y = PLAYER_START.y;
  game.player.vx = 0;
  game.player.vy = 0;
  game.cameraX = cameraTargetX();
  seedMinuteSixState();
}

function draw() {
  const sx = game.shake ? rand(-game.shake, game.shake) : 0;
  const sy = game.shake ? rand(-game.shake, game.shake) : 0;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.translate(sx, sy);
  drawBackground();
  ctx.save();
  ctx.translate(-game.cameraX, 0);
  drawDrops();
  drawEnemies();
  drawObstacles();
  drawPowersBehind();
  drawPlayer();
  drawBullets();
  drawParticles();
  ctx.restore();
  drawUi();
  drawFlash();
  ctx.restore();
}

function drawBackground() {
  const stage = activeStage();
  const bg = images[stage.key];
  ctx.fillStyle = "#030309";
  ctx.fillRect(0, 0, W, H);
  if (bg) {
    ctx.drawImage(bg, game.cameraX, 0, W, H, 0, 0, W, H);
  }

  ctx.save();
  ctx.translate(-game.cameraX, 0);
  ctx.globalCompositeOperation = "lighter";
  for (const s of bgStars) {
    if (s.x < game.cameraX - 20 || s.x > game.cameraX + W + 20) continue;
    ctx.globalAlpha = s.a * (0.7 + Math.sin(game.time * 1.2 + s.x) * 0.3);
    ctx.fillStyle = s.c;
    ctx.fillRect(s.x, s.y, s.r, s.r);
  }

  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = stage.tint;
  for (const d of bgDecals) {
    if (d.x < game.cameraX - 80 || d.x > game.cameraX + W + 80) continue;
    drawMandala(d.x, d.y, d.r, game.time * 0.08 + d.rot);
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const playerScreenX = worldToScreenX(game.player.x);
  const rg = ctx.createRadialGradient(playerScreenX, game.player.y, 20, playerScreenX, game.player.y, 420);
  rg.addColorStop(0, "rgba(255,79,216,0.12)");
  rg.addColorStop(0.46, "rgba(98,249,255,0.055)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawObstacles() {
  const stage = activeStage();
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const obstacle of stage.obstacles) {
    if (obstacle.x + obstacle.rx < game.cameraX - 120 || obstacle.x - obstacle.rx > game.cameraX + W + 120) continue;
    const pulse = 0.65 + Math.sin(game.time * 2 + obstacle.x) * 0.18;
    ctx.globalAlpha = 0.045;
    ctx.fillStyle = stage.tint;
    ctx.beginPath();
    ctx.ellipse(obstacle.x, obstacle.y, obstacle.rx, obstacle.ry, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = pulse * 0.22;
    ctx.strokeStyle = stage.tint;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.ellipse(obstacle.x, obstacle.y, obstacle.rx + 6, obstacle.ry + 4, 0, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawMandala(x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    ctx.moveTo(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.68, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of game.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rot);
    const img = images[enemy.type.key];
    const sheet =
      enemy.type.key === "news"
        ? images.newsSheet
        : enemy.type.key === "cart"
          ? images.cartSheet
          : enemy.type.key === "notification"
            ? images.notificationSheet
            : enemy.type.key === "bill"
              ? images.billSheet
              : null;
    const animFrame = Math.floor(game.time * (enemy.type.key === "cart" || enemy.type.key === "notification" ? 12 : 10) + enemy.id) % 16;
    const scaleHit = enemy.hit > 0 ? 1.16 : 1;
    const size = enemy.size * scaleHit;
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = enemy.crystal ? 0.5 : 0.11;
    ctx.fillStyle = enemy.crystal ? "rgba(255,230,255,0.64)" : enemy.type.color;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius * (enemy.crystal ? 1.95 : 1.28), 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (sheet) {
      drawSheetFrame(sheet, animFrame, 0, 0, size * 1.08, 0);
    } else {
      drawSprite(img, 0, 0, size, 0);
    }
    if (enemy.crystal) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(255,245,255,0.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius * 1.42 + Math.sin(game.time * 8 + enemy.id) * 2, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,79,216,0.52)";
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius * 1.72 + Math.cos(game.time * 7 + enemy.id) * 2, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawDrops() {
  for (const shard of game.xp) {
    const img = shard.rare ? images.prism : images.xp;
    const size = shard.rare ? 19 : 12;
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(game.time * (shard.rare ? 2.6 : 1.7));
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = shard.rare ? 0.55 : 0.35;
    ctx.fillStyle = shard.rare ? "#ff4fd8" : "#62f9ff";
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    drawSprite(img, 0, 0, size, 0);
    ctx.restore();
  }

  for (const sugar of game.sugars) {
    const size = 25 + Math.sin(sugar.pulse) * 2;
    ctx.save();
    ctx.translate(sugar.x, sugar.y);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(255,245,255,0.58)";
    ctx.beginPath();
    ctx.arc(0, 0, 24 + Math.sin(sugar.pulse) * 6, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    drawSheetFrame(images.sugarSheet, Math.floor(game.time * 13 + sugar.pulse) % 16, 0, 0, size * 1.15, 0);
    ctx.restore();
  }
}

function drawPowersBehind() {
  const p = game.player;
  const shield = 69 + Math.sin(game.time * 4) * 3;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "rgba(255, 79, 216, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, shield, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = "rgba(120, 255, 93, 0.36)";
  ctx.rotate(game.time * 0.9);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (shield - 7), Math.sin(a) * (shield - 7));
    ctx.lineTo(Math.cos(a) * (shield + 14), Math.sin(a) * (shield + 14));
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const a = game.time * 1.7 + (i / 5) * TAU;
    drawLeaf(Math.cos(a) * 52, Math.sin(a) * 52, a);
  }
  ctx.restore();

  for (const t of game.damageTexts) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.max(0, t.life);
    ctx.strokeStyle = t.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
}

function drawLeaf(x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = "rgba(120,255,93,0.68)";
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(7, 0);
  ctx.lineTo(0, 9);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  const p = game.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalCompositeOperation = "lighter";
  const aura = 46 + Math.sin(game.time * 5) * 4 + game.sugar * 10;
  const g = ctx.createRadialGradient(0, 0, 5, 0, 0, aura);
  g.addColorStop(0, "rgba(255,255,255,0.42)");
  g.addColorStop(0.28, "rgba(120,255,93,0.24)");
  g.addColorStop(0.58, "rgba(255,79,216,0.16)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, aura, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(98,249,255,0.56)";
  ctx.lineWidth = 2;
  drawMandala(0, 0, 38, game.time * 1.3);
  ctx.globalCompositeOperation = "source-over";
  const size = 51 + game.sugar * 5;
  let sheet = images.eyeSheet;
  let frame = Math.floor(game.time * 11) % 16;
  let drawSize = size * 1.22;
  if (game.eyeState === "damage") {
    sheet = images.eyeDamageSheet;
    frame = clamp(15 - Math.floor((game.eyeStateTimer / 0.58) * 16), 0, 15);
    drawSize = size * 1.28;
  } else if (game.eyeState === "evolve") {
    sheet = images.eyeEvolveSheet;
    frame = clamp(15 - Math.floor((game.eyeStateTimer / 1.25) * 16), 0, 15);
    drawSize = size * 1.34;
  } else if (game.eyeState === "death") {
    sheet = images.eyeDeathSheet;
    frame = clamp(15 - Math.floor((game.eyeStateTimer / 1.1) * 16), 0, 15);
    drawSize = size * 1.28;
  }
  drawSheetFrame(sheet, frame, 0, 0, drawSize, 0);
  if (p.invuln > 0) {
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 33 + Math.sin(game.time * 18) * 5, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBullets() {
  for (const bullet of game.bullets) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < bullet.trail.length; i++) {
      const t = bullet.trail[i];
      ctx.globalAlpha = i / bullet.trail.length * 0.42;
      ctx.fillStyle = bullet.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, bullet.radius * (i / bullet.trail.length), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(Math.atan2(bullet.vy, bullet.vx));
    drawSprite(bullet.kind === "leaf" ? images.projectileLeaf : images.projectilePrism, 0, 0, bullet.kind === "leaf" ? 22 : 25, 0);
    ctx.restore();
  }
}

function drawParticles() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const p of game.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawUi() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(24, 22, 166, 20);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.strokeRect(24, 22, 166, 20);
  const fg = ctx.createLinearGradient(28, 0, 184, 0);
  fg.addColorStop(0, "#78ff5d");
  fg.addColorStop(1, "#ff4fd8");
  ctx.fillStyle = fg;
  ctx.fillRect(28, 26, 158 * game.focus, 12);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(W * 0.33, 25, W * 0.34, 8);
  ctx.fillStyle = "#ffe96a";
  ctx.fillRect(W * 0.33, 25, W * 0.34 * game.clarity, 8);
  ctx.fillStyle = "rgba(249,251,255,0.72)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  const mins = Math.floor(game.time / 60);
  const secs = Math.floor(game.time % 60).toString().padStart(2, "0");
  ctx.fillText(`${mins}:${secs}`, W / 2, 19);
  ctx.fillStyle = "rgba(249,251,255,0.52)";
  ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`${game.stageIndex + 1}/3 ${activeStage().name}`, W / 2, 49);

  for (let i = 0; i < 3; i++) {
    const x = W - 98 + i * 27;
    const y = 22;
    ctx.save();
    ctx.globalAlpha = i < game.sugar ? 1 : 0.25;
    if (i < game.sugar) {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,230,255,0.42)";
      ctx.beginPath();
      ctx.arc(x + 11, y + 11, 18, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    drawSheetFrame(images.sugarSheet, Math.floor(game.time * 10 + i) % 16, x + 11, y + 11, 23, 0);
    ctx.restore();
  }

  drawGhostControls();
  ctx.restore();
}

function drawGhostControls() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.11)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(112, H - 100, 50, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(112 + pointerVector.x * 24, H - 100 + pointerVector.y * 24, 22, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W - 96, H - 96, 34, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(W - 106, H - 106);
  ctx.lineTo(W - 78, H - 96);
  ctx.lineTo(W - 106, H - 86);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFlash() {
  if (game.flash <= 0 && game.damagePulse <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  if (game.flash > 0) {
    ctx.globalAlpha = game.flash * 0.28;
    ctx.fillStyle = game.sugar >= 2 ? "#fff6ff" : "#ff4fd8";
    ctx.fillRect(0, 0, W, H);
  }
  if (game.damagePulse > 0) {
    const a = game.damagePulse;
    ctx.globalAlpha = a * 0.5;
    const g = ctx.createRadialGradient(W * 0.5, H * 0.52, H * 0.22, W * 0.5, H * 0.52, H * 0.78);
    g.addColorStop(0, "rgba(255,0,0,0)");
    g.addColorStop(0.52, "rgba(255,35,90,0.12)");
    g.addColorStop(1, "rgba(255,35,90,0.8)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = a * 0.75;
    ctx.strokeStyle = "rgba(255,245,255,0.86)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, W - 16, H - 16);
  }
  ctx.restore();
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  if (running) update(dt);
  draw();
  requestAnimationFrame(loop);
}

function start() {
  initAudio();
  if (audioCtx?.state === "suspended") audioCtx.resume();
  running = true;
  bootCard.classList.add("hidden");
  resetRun();
}

function setupInput() {
  window.addEventListener("keydown", (event) => {
    keys.add(event.key.toLowerCase());
    if (event.key === " " || event.key === "Shift") dash();
    if (event.key === "1" || event.key === "2" || event.key === "3") {
      game.stageIndex = Number(event.key) - 1;
      game.flash = Math.max(game.flash, 0.2);
      burst(game.player.x, game.player.y, activeStage().tint, 26, 170);
    }
    if (event.key.toLowerCase() === "h") {
      game.damagePulse = 1;
      game.shake = 18;
      setEyeState("damage", 0.58);
    }
    if (event.key.toLowerCase() === "e") {
      game.flash = Math.max(game.flash, 0.3);
      setEyeState("evolve", 1.25);
    }
    if (event.key.toLowerCase() === "k") {
      game.damagePulse = 1;
      game.shake = 20;
      setEyeState("death", 1.1);
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
  window.addEventListener("gamepadconnected", () => {
    padStatus.textContent = "controle: conectado";
  });
  window.addEventListener("gamepaddisconnected", () => {
    padStatus.textContent = "controle: procurando";
  });

  canvas.addEventListener("pointerdown", (event) => {
    pointerId = event.pointerId;
    canvas.setPointerCapture(pointerId);
    const p = toCanvas(event);
    pointerOrigin = p;
    pointerVector = { x: 0, y: 0 };
    if (!running) start();
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || !pointerOrigin) return;
    const p = toCanvas(event);
    const dx = p.x - pointerOrigin.x;
    const dy = p.y - pointerOrigin.y;
    const l = Math.max(1, Math.hypot(dx, dy));
    const m = Math.min(1, l / 58);
    pointerVector = { x: (dx / l) * m, y: (dy / l) * m };
  });
  canvas.addEventListener("pointerup", clearPointer);
  canvas.addEventListener("pointercancel", clearPointer);
  startButton.addEventListener("click", start);
}

function toCanvas(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H,
  };
}

function clearPointer(event) {
  if (event.pointerId !== pointerId) return;
  pointerId = null;
  pointerOrigin = null;
  pointerVector = { x: 0, y: 0 };
}

async function init() {
  setupInput();
  await loadImages();
  seedMinuteSixState();
  requestAnimationFrame(loop);
}

init();
