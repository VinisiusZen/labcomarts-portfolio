const canvas = document.getElementById("testCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
const stateLabel = document.getElementById("stateLabel");
const manualState = document.getElementById("manualState");
const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");
const fpsSlider = document.getElementById("fpsSlider");
const fpsValue = document.getElementById("fpsValue");
const boundsToggle = document.getElementById("boundsToggle");
const ghostToggle = document.getElementById("ghostToggle");

const MANIFEST = window.VIDEO_SPRITE_TEST_MANIFEST;
const STATE_ORDER = ["idle", "walk", "run", "attack"];
const pressed = new Set();
const animations = {};

let width = 1280;
let height = 720;
let dpr = 1;
let activeState = "idle";
let frameIndex = 0;
let frameElapsed = 0;
let lastTime = 0;
let catX = null;
let catYRatio = 0.72;
let facing = 1;
let attackTimer = 0;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadAnimations() {
  for (const state of STATE_ORDER) {
    const config = MANIFEST.states[state];
    const frames = await Promise.all(config.frames.map((src) => loadImage(src)));
    animations[state] = {
      frames: frames.filter(Boolean),
      fps: config.fps,
      sourceFrames: config.sourceFrames,
    };
  }
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  width = Math.floor(rect.width);
  height = Math.floor(rect.height);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (catX === null) catX = width * 0.5;
  const scale = Number(scaleSlider.value) || 0.72;
  const halfFrame = (MANIFEST.canvas * scale) / 2;
  catX = Math.min(Math.max(catX, halfFrame), width - halfFrame);
}

function desiredState() {
  if (manualState.value !== "auto") return manualState.value;
  if (attackTimer > 0) return "attack";
  const moving = pressed.has("KeyA") || pressed.has("ArrowLeft") || pressed.has("KeyD") || pressed.has("ArrowRight");
  if (!moving) return "idle";
  return pressed.has("ShiftLeft") || pressed.has("ShiftRight") ? "run" : "walk";
}

function setState(state) {
  if (state === activeState) return;
  activeState = state;
  frameIndex = 0;
  frameElapsed = 0;
  stateLabel.textContent = state === "attack" ? "STARTLED" : state.toUpperCase();
}

function update(delta) {
  attackTimer = Math.max(0, attackTimer - delta);
  setState(desiredState());

  const horizontal = (pressed.has("KeyD") || pressed.has("ArrowRight") ? 1 : 0) - (pressed.has("KeyA") || pressed.has("ArrowLeft") ? 1 : 0);
  const vertical = (pressed.has("KeyS") || pressed.has("ArrowDown") ? 1 : 0) - (pressed.has("KeyW") || pressed.has("ArrowUp") ? 1 : 0);
  const speed = activeState === "run" ? 360 : 190;

  if (horizontal) {
    facing = horizontal > 0 ? 1 : -1;
    catX += horizontal * speed * delta;
  }
  if (vertical) catYRatio += vertical * 0.34 * delta;

  const scale = Number(scaleSlider.value) || 0.72;
  const halfFrame = (MANIFEST.canvas * scale) / 2;
  catX = Math.min(Math.max(catX, halfFrame), width - halfFrame);
  catYRatio = Math.min(Math.max(catYRatio, 0.46), 0.82);

  const anim = animations[activeState];
  const fps = Number(fpsSlider.value) || anim?.fps || 12;
  frameElapsed += delta;
  while (anim?.frames.length && frameElapsed >= 1 / fps) {
    frameElapsed -= 1 / fps;
    frameIndex = (frameIndex + 1) % anim.frames.length;
  }
}

function drawStage() {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#070512");
  sky.addColorStop(0.65, "#10102a");
  sky.addColorStop(1, "#05040d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const upper = height * 0.46;
  const lower = height * 0.82;
  const floor = ctx.createLinearGradient(0, upper, 0, lower);
  floor.addColorStop(0, "rgba(0, 240, 255, 0.035)");
  floor.addColorStop(0.5, "rgba(245, 241, 255, 0.035)");
  floor.addColorStop(1, "rgba(246, 255, 59, 0.045)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, upper, width, lower - upper);

  const sideFade = ctx.createLinearGradient(0, 0, width, 0);
  sideFade.addColorStop(0, "rgba(0, 240, 255, 0)");
  sideFade.addColorStop(0.5, "rgba(0, 240, 255, 0.08)");
  sideFade.addColorStop(1, "rgba(0, 240, 255, 0)");

  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const y = upper + t * (lower - upper);
    ctx.strokeStyle = `rgba(245, 241, 255, ${0.07 + t * 0.16})`;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y));
    ctx.lineTo(width, Math.round(y));
    ctx.stroke();
  }

  ctx.strokeStyle = sideFade;
  ctx.setLineDash([8, 18]);
  for (let x = width * 0.18; x < width * 0.86; x += width * 0.17) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x), upper);
    ctx.lineTo(Math.round(x), lower);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  if (boundsToggle.checked) {
    drawLimitLine(upper, "LIMITE SUPERIOR", "rgba(0, 240, 255, 0.72)");
    drawLimitLine(lower, "LIMITE INFERIOR", "rgba(255, 42, 157, 0.72)");
  }
}

function drawLimitLine(y, label, color) {
  const gradient = ctx.createLinearGradient(0, y, width, y);
  gradient.addColorStop(0, "rgba(245, 241, 255, 0)");
  gradient.addColorStop(0.12, color);
  gradient.addColorStop(0.88, color);
  gradient.addColorStop(1, "rgba(245, 241, 255, 0)");
  ctx.strokeStyle = gradient;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = "10px 'Lucida Console', monospace";
  ctx.fillText(label, 22, y - 8);
}

function drawCat() {
  const anim = animations[activeState];
  if (!anim?.frames.length) return;
  const img = anim.frames[frameIndex];
  const scale = Number(scaleSlider.value) || 0.9;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const groundY = height * catYRatio;
  const x = Math.round(catX - drawW / 2);
  const y = Math.round(groundY - drawH);

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.34)";
  ctx.beginPath();
  ctx.ellipse(catX, groundY - 8, 92 * scale, 18 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (ghostToggle.checked && anim.frames.length > 2) {
    const ghost = anim.frames[(frameIndex - 1 + anim.frames.length) % anim.frames.length];
    drawImageFlipped(ghost, x - facing * 12, y, drawW, drawH, 0.22);
  }
  drawImageFlipped(img, x, y, drawW, drawH, 1);
}

function drawImageFlipped(img, x, y, w, h, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowBlur = 0;
  if (facing < 0) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, w, h);
  } else {
    ctx.drawImage(img, x, y, w, h);
  }
  ctx.restore();
}

function draw(now) {
  drawStage();
  drawCat();
  ctx.fillStyle = "rgba(7,5,18,0.68)";
  ctx.fillRect(18, height - 48, 430, 30);
  ctx.fillStyle = "#f5f1ff";
  ctx.font = "11px 'Lucida Console', monospace";
  const sourceFrame = animations[activeState]?.sourceFrames?.[frameIndex];
  ctx.fillText(`state ${stateLabel.textContent} | frame ${frameIndex + 1} | video frame ${sourceFrame ?? "-"}`, 28, height - 29);
}

function loop(now) {
  const delta = Math.min(0.05, (now - lastTime) / 1000 || 0);
  lastTime = now;
  update(delta);
  draw(now);
  requestAnimationFrame(loop);
}

function bindUi() {
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => {
    pressed.add(event.code);
    if (event.code === "KeyJ") attackTimer = 0.75;
  });
  window.addEventListener("keyup", (event) => pressed.delete(event.code));
  scaleSlider.addEventListener("input", () => {
    scaleValue.textContent = Number(scaleSlider.value).toFixed(2);
  });
  fpsSlider.addEventListener("input", () => {
    fpsValue.textContent = String(fpsSlider.value);
  });
}

async function start() {
  resize();
  bindUi();
  await loadAnimations();
  stateLabel.textContent = "IDLE";
  requestAnimationFrame((now) => {
    lastTime = now;
    requestAnimationFrame(loop);
  });
}

start();
