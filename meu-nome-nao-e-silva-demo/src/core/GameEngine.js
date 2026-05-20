import { enemyClasses } from "../data/enemies.js";
import { combatSystemRules } from "../data/combatTuning.js";
import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import { Input } from "./Input.js";
import { FxLayer } from "../render/fx.js";
import { drawActor, drawEnvironment, drawSceneProps } from "../render/draw.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class GameEngine {
  constructor({ canvas, hud, scene, assets, audio, onStateChange }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.hud = hud;
    this.scene = scene;
    this.assets = assets;
    this.audio = audio;
    this.onStateChange = onStateChange;
    const inputTarget =
      typeof window !== "undefined"
        ? window
        : { addEventListener: () => {}, removeEventListener: () => {} };
    this.input = new Input(inputTarget);
    this.fx = new FxLayer();
    this.width = 1280;
    this.height = 720;
    this.worldScale = 1;
    this.shell = canvas.closest?.(".game-shell") || null;
    this.pauseOverlay = this.shell?.querySelector("[data-pause]") || null;
    this.paused = false;
    this.camera = { x: 0, y: 0 };
    this.player = new Player(scene.playerSpawn);
    this.enemies = [];
    this.spawns = this.flattenSpawns(scene.waves);
    this.waveIndex = 0;
    this.elapsed = 0;
    this.lastTime = 0;
    this.running = false;
    this.result = null;
    this.debugHitboxes = false;
    this.toast = scene.objective;
    this.waveLabel = "";
    this.resizeHandler = () => this.resize();
  }

  flattenSpawns(waves) {
    let offset = 0;
    return waves.flatMap((wave, index) => {
      const waveStart = offset + (index === 0 ? 0 : 2.4);
      const spawns = wave.spawns.map((spawn) => ({ ...spawn, waveId: wave.id, time: waveStart + spawn.delay }));
      offset = Math.max(...spawns.map((spawn) => spawn.time)) + 2.2;
      return spawns;
    });
  }

  start() {
    this.resize();
    this.running = true;
    this.input.attach();
    window.addEventListener("resize", this.resizeHandler);
    requestAnimationFrame((time) => this.loop(time));
  }

  stop() {
    this.running = false;
    this.input.detach();
    window.removeEventListener("resize", this.resizeHandler);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, Math.floor(rect.width * scale));
    this.canvas.height = Math.max(1, Math.floor(rect.height * scale));
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
    this.worldScale = Math.max(0.45, Math.min(1.18, this.height / 720));
  }

  loop(time) {
    if (!this.running) return;
    const dt = Math.min(0.033, (time - this.lastTime) / 1000 || 0.016);
    this.lastTime = time;
    this.input.updateGamepad();
    if (this.fx.hitStop <= 0) this.update(dt);
    else this.fx.update(dt);
    this.draw();
    this.input.endFrame();
    requestAnimationFrame((next) => this.loop(next));
  }

  update(dt) {
    if (this.input.wasPressed("pause")) this.togglePause();
    if (this.input.wasPressed("restart")) this.onStateChange("restart");
    if (this.paused) {
      this.updateHud();
      return;
    }

    this.elapsed += dt;
    this.spawnDueEnemies();
    this.player.update(dt, this.input, this.scene, this);
    for (const enemy of this.enemies) enemy.update(dt, this.player, this.scene, this);
    this.resolveEnemySpacing(dt);
    this.enemies = this.enemies.filter((enemy) => enemy.state !== "defeated" || enemy.defeatTimer < 1.3);
    this.fx.update(dt);
    this.updateCamera();
    this.updateHud();
    this.checkResult();
  }

  togglePause() {
    if (this.result) return;
    this.paused = !this.paused;
    this.audio?.play("pause");
    this.pauseOverlay?.classList.toggle("hidden", !this.paused);
    this.shell?.classList.toggle("is-paused", this.paused);
  }

  spawnDueEnemies() {
    while (this.waveIndex < this.spawns.length && this.elapsed >= this.spawns[this.waveIndex].time) {
      const spawn = this.spawns[this.waveIndex];
      const config = enemyClasses[spawn.enemyClass];
      if (config) {
        this.waveLabel = spawn.waveId;
        this.enemies.push(new Enemy(config, spawn));
        this.audio?.play("enemySpawn", spawn.elite ? 1.25 : 0.8);
        this.fx.add("text", spawn.x, this.laneToY(spawn.lane) - 110, {
          text: spawn.elite ? "elite" : config.displayName.toLowerCase(),
          color: spawn.elite ? "#d38b3e" : "#d8cfb7",
          life: 0.9
        });
      }
      this.waveIndex += 1;
    }
  }

  updateCamera() {
    const lookAhead = this.player.facing * Math.min(160, Math.abs(this.player.vx) * 0.42);
    const focusX = this.player.x + lookAhead;
    const maxCameraX = Math.max(0, this.scene.bounds.right - this.width + 160);
    const target = clamp(focusX - this.width * 0.38, 0, maxCameraX);
    this.camera.x += (target - this.camera.x) * 0.11;
  }

  updateHud() {
    if (!this.hud) return;
    this.hud.classList.toggle("is-critical", this.player.body <= 28);
    this.hud.querySelector("[data-body]").style.setProperty("--value", `${this.player.body}%`);
    this.hud.querySelector("[data-cohesion]").style.setProperty("--value", `${this.player.cohesion}%`);
    const wave = this.waveLabel ? ` | ${this.waveLabel.replaceAll("-", " ")}` : "";
    this.hud.querySelector("[data-phase]").textContent = `${this.scene.title}${wave} | ${this.remainingEnemies()} threats`;
    this.hud.querySelector("[data-combo]").textContent =
      this.player.comboStep > 0 ? `${this.player.comboName} x${this.player.comboStep}` : "Combo x0";
    this.hud.querySelector("[data-cooldown]").textContent =
      this.player.pulseCooldown <= 0 ? "Pulse ready" : `Pulse ${Math.ceil(this.player.pulseCooldown)}s`;
  }

  resolveEnemySpacing(dt) {
    for (let i = 0; i < this.enemies.length; i += 1) {
      const a = this.enemies[i];
      if (a.state === "defeated") continue;
      for (let j = i + 1; j < this.enemies.length; j += 1) {
        const b = this.enemies[j];
        if (b.state === "defeated") continue;
        const laneGap = Math.abs(a.lane - b.lane);
        const xGap = Math.abs(a.x - b.x);
        if (laneGap < 0.08 && xGap < 54) {
          const push = (54 - xGap) * 0.5 * dt * 8;
          const direction = a.x <= b.x ? -1 : 1;
          a.x = clamp(a.x + direction * push, this.scene.bounds.left, this.scene.bounds.right);
          b.x = clamp(b.x - direction * push, this.scene.bounds.left, this.scene.bounds.right);
        }
      }
    }
  }

  remainingEnemies() {
    const waiting = this.spawns.length - this.waveIndex;
    const alive = this.enemies.filter((enemy) => enemy.state !== "defeated").length;
    return waiting + alive;
  }

  checkResult() {
    if (this.result) return;
    if (this.player.body <= 0) {
      this.result = "defeat";
      this.audio?.play("defeat");
      setTimeout(() => this.onStateChange("defeat"), 650);
      return;
    }
    if (this.waveIndex >= this.spawns.length && this.enemies.every((enemy) => enemy.state === "defeated")) {
      this.result = "victory";
      this.audio?.play("victory");
      setTimeout(() => this.onStateChange("victory"), 650);
    }
  }

  applyPlayerAttack(player, kind) {
    const profile = player.currentHit;
    const attackProfile = player.currentAttack;
    const base = kind === "light" ? 15 : 29;
    const comboBonus = kind === "light" ? player.comboStep * 2 : 0;
    const reach = profile?.reach ?? (kind === "heavy" ? 122 : 88);
    const hitY = player.lane;
    let connected = false;
    for (const enemy of this.enemies) {
      if (enemy.state === "defeated") continue;
      const allAround = Boolean(profile?.allAround);
      const inFront = allAround || (player.facing > 0 ? enemy.x >= player.x - 12 : enemy.x <= player.x + 12);
      const inReach = Math.abs(enemy.x - player.x) < reach;
      const inLane = Math.abs(enemy.lane - hitY) < (profile?.laneWidth ?? (kind === "heavy" ? 0.18 : 0.13));
      const hitFacing = allAround ? (enemy.x < player.x ? -1 : 1) : player.facing;
      const hit = {
        damage: profile?.damage ?? base + comboBonus,
        knockback: profile?.knockback ?? (kind === "heavy" ? 360 : 205 + player.comboStep * 18),
        facing: hitFacing,
        stun: profile?.stun ?? (kind === "heavy" || player.comboStep >= 3),
        launch: profile?.launch ?? 0
      };
      if (inFront && inReach && inLane && enemy.receiveHit(hit)) {
        connected = true;
        this.fx.add("impact", enemy.x, this.screenY(enemy) - enemy.height * 0.45, {
          size: profile?.launch ? 62 : kind === "heavy" ? 54 : 34,
          color: kind === "special" || attackProfile?.state === "special" ? "#8d2f25" : kind === "heavy" || profile?.launch ? "#d38b3e" : "#d8cfb7"
        });
        this.fx.add("text", enemy.x, this.screenY(enemy) - enemy.height, {
          text: profile?.launch ? "launch" : attackProfile?.name === "red sash" ? "sash" : player.comboName === "breaker" ? "break" : kind === "heavy" ? "break" : "hit",
          color: "#f1ead1",
          life: 0.34
        });
      }
    }
    if (connected) {
      const gain = attackProfile?.state === "special" ? 0 : kind === "light" ? combatSystemRules.spirit.gain.lightHit : combatSystemRules.spirit.gain.heavyHit;
      player.cohesion = Math.min(player.maxCohesion, player.cohesion + gain);
      this.audio?.play(profile?.launch ? "breaker" : kind === "heavy" ? "hitHeavy" : "hitLight");
      this.fx.shake(attackProfile?.state === "special" ? 15 : profile?.launch ? 13 : kind === "heavy" ? 12 : 6);
      this.fx.stop(attackProfile?.state === "special" ? 0.12 : profile?.launch ? 0.095 : kind === "heavy" ? 0.085 : 0.045);
    }
  }

  applyGrab(player) {
    const target = this.enemies
      .filter((enemy) => enemy.state !== "defeated")
      .find((enemy) => Math.abs(enemy.x - player.x) < 64 && Math.abs(enemy.lane - player.lane) < 0.14);
    if (!target) return;
    target.receiveHit({ damage: 10, knockback: player.facing * 70, facing: player.facing, stun: true });
    player.cohesion = Math.min(player.maxCohesion, player.cohesion + combatSystemRules.spirit.gain.grab);
    this.audio?.play("grab");
    this.fx.add("impact", target.x, this.screenY(target) - 70, { size: 46, color: "#d8cfb7" });
    this.fx.shake(5);
  }

  applyPulse(player) {
    let connected = false;
    for (const enemy of this.enemies) {
      if (enemy.state === "defeated") continue;
      const distance = Math.abs(enemy.x - player.x) + Math.abs(enemy.lane - player.lane) * 640;
      if (distance < 240) {
        enemy.receiveHit({
          damage: 18,
          knockback: enemy.x < player.x ? -270 : 270,
          facing: enemy.x < player.x ? -1 : 1,
          stun: true
        });
        connected = true;
      }
    }
    this.fx.add("impact", player.x, this.screenY(player) - 52, { size: 118, color: "#cfd7cf", life: 0.58 });
    this.fx.add("text", player.x, this.screenY(player) - 118, {
      text: connected ? "vision" : "empty",
      color: connected ? "#f1ead1" : "rgba(216, 207, 183, 0.7)",
      life: 0.52
    });
    this.audio?.play("pulse", connected ? 1.15 : 0.75);
    if (connected) this.fx.stop(0.1);
  }

  applyEnemyAttack(enemy, player) {
    if (enemy.state === "defeated") return;
    const inReach = Math.abs(enemy.x - player.x) <= enemy.reach + 20;
    const inLane = Math.abs(enemy.lane - player.lane) < 0.13;
    if (inReach && inLane && player.receiveHit(enemy.damage, enemy.x)) {
      this.audio?.play("playerHit");
      this.fx.add("impact", player.x, this.screenY(player) - 74, { size: 38, color: "#8d2f25" });
      this.fx.shake(9);
      this.fx.stop(0.045);
    } else {
      this.audio?.play("enemyAttack", 0.7);
      this.fx.add("slash", enemy.x + enemy.facing * 48, this.screenY(enemy) - 62, {
        size: 38,
        color: "rgba(141, 47, 37, 0.88)"
      });
    }
  }

  laneToY(lane) {
    const top = this.height * 0.56;
    const bottom = this.height * 0.82;
    return top + lane * (bottom - top);
  }

  screenY(actor) {
    return this.laneToY(actor.lane) - actor.z;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    const shakeX = (Math.random() - 0.5) * this.fx.cameraShake;
    const shakeY = (Math.random() - 0.5) * this.fx.cameraShake;
    ctx.translate(shakeX, shakeY);
    drawEnvironment(ctx, this);
    drawSceneProps(ctx, this, "far");
    drawSceneProps(ctx, this, "back");

    const drawList = [this.player, ...this.enemies].sort((a, b) => a.lane - b.lane || a.x - b.x);
    for (const actor of drawList) drawActor(ctx, actor, this, actor === this.player ? "player" : "enemy");
    drawSceneProps(ctx, this, "front");
    this.fx.draw(ctx, this.camera);
    this.drawVignette(ctx);
    ctx.restore();
  }

  drawVignette(ctx) {
    const rupture = 1 - this.player.cohesion / this.player.maxCohesion;
    const gradient = ctx.createRadialGradient(this.width * 0.5, this.height * 0.58, this.height * 0.2, this.width * 0.5, this.height * 0.58, this.height * 0.84);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.68, `rgba(0,0,0,${0.28 + rupture * 0.12})`);
    gradient.addColorStop(1, `rgba(70,0,0,${0.36 + rupture * 0.3})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
