import { buildPlayerAttackProfile, combatSystemRules } from "../data/combatTuning.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Player {
  constructor(spawn) {
    this.x = spawn.x;
    this.lane = spawn.lane;
    this.z = 0;
    this.vx = 0;
    this.vLane = 0;
    this.vz = 0;
    this.facing = 1;
    this.body = 100;
    this.maxBody = 100;
    this.cohesion = 100;
    this.maxCohesion = 100;
    this.width = 74;
    this.height = 138;
    this.state = "idle";
    this.stateTime = 0;
    this.attackTime = 0;
    this.attackId = 0;
    this.comboStep = 0;
    this.comboWindow = 0;
    this.comboName = "none";
    this.queuedAttack = null;
    this.queueBuffer = 0;
    this.currentHit = null;
    this.currentAttack = null;
    this.attackKind = null;
    this.spriteAssetId = null;
    this.spriteState = null;
    this.invulnerable = 0;
    this.hitFlash = 0;
    this.grabCooldown = 0;
    this.pulseCooldown = 0;
    this.didStrike = false;
  }

  update(dt, input, scene, engine) {
    this.stateTime += dt;
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.grabCooldown = Math.max(0, this.grabCooldown - dt);
    this.pulseCooldown = Math.max(0, this.pulseCooldown - dt);
    this.comboWindow = Math.max(0, this.comboWindow - dt);
    this.queueBuffer = Math.max(0, this.queueBuffer - dt);
    if (this.queueBuffer <= 0) this.queuedAttack = null;
    if (this.comboWindow <= 0 && !this.isAttacking()) {
      this.comboStep = 0;
      this.comboName = "none";
    }

    if (this.body <= 0) {
      this.state = "defeated";
      this.clearActionSprite();
      return;
    }

    if (input.wasPressed("light")) {
      const axisX = input.axisX();
      const isDashLight = this.z <= 0 && input.isDown("run") && Math.abs(axisX) > 0;
      const airKind = input.axisLane() > 0.35 ? "airDown" : Math.abs(axisX) > 0 ? "airForward" : "airLight";
      this.requestAttack(this.z > 0 ? airKind : isDashLight ? "dashLight" : "light", engine);
    }
    if (input.wasPressed("heavy")) {
      const isLauncher = input.axisLane() > 0.35 && this.z <= 0;
      this.requestAttack(isLauncher ? "launcher" : "heavy", engine);
    }
    if (input.wasPressed("special")) this.trySpecial(engine, input);
    if (input.wasPressed("pickup")) this.tryPickup(engine);
    if (input.wasPressed("star")) this.tryStar(engine);
    if (input.wasPressed("grab")) this.tryGrab(engine);
    if (input.wasPressed("pulse")) this.tryPulse(engine);
    if (input.wasPressed("dodge")) {
      if (this.isAttacking() && this.didStrike && this.cohesion >= combatSystemRules.spirit.costs.dodgeCancel) {
        this.cohesion -= combatSystemRules.spirit.costs.dodgeCancel;
        this.startDodge(input.axisX() || this.facing, true);
        engine.fx.add("text", this.x, engine.screenY(this) - 92, {
          text: "cancel",
          color: "rgba(216, 207, 183, 0.9)",
          life: 0.28
        });
      } else {
        this.startDodge(input.axisX() || this.facing);
      }
    }
    if (input.wasPressed("jump") && this.z === 0) {
      this.vz = 430;
      this.state = "jump";
      this.stateTime = 0;
      this.spriteAssetId = "silvaActions";
      this.spriteState = "jump";
    }

    if (this.isLocked()) {
      this.updateLocked(dt, scene, engine);
      return;
    }

    const runMod = input.isDown("run") ? 1.55 : 1;
    const axisX = input.axisX();
    const axisLane = input.axisLane();
    const airborne = this.z > 0 || this.vz > 0;
    if (axisX !== 0) this.facing = Math.sign(axisX);
    this.vx = axisX * 178 * runMod;
    this.vLane = axisLane * 0.72 * runMod;

    if (airborne) {
      this.state = "jump";
      this.spriteAssetId = this.spriteAssetId || "silvaActions";
      this.spriteState = this.spriteState || "jump";
    } else if (Math.abs(axisX) > 0 || Math.abs(axisLane) > 0) {
      this.state = input.isDown("run") ? "run" : "walk";
      this.clearActionSprite();
    } else if (this.z === 0) {
      this.state = "idle";
      this.clearActionSprite();
    }

    this.integrate(dt, scene);
  }

  isLocked() {
    return ["light", "heavy", "special", "air", "dodge", "hit", "pulse", "grab"].includes(this.state);
  }

  isAttacking() {
    return ["light", "heavy", "special", "air"].includes(this.state);
  }

  updateLocked(dt, scene, engine) {
    if (this.state === "dodge") {
      this.vx = this.facing * 430;
      this.integrate(dt, scene);
      if (this.stateTime > 0.24) {
        this.state = "idle";
        this.clearActionSprite();
      }
      return;
    }

    if (this.state === "hit") {
      this.vx *= Math.pow(0.04, dt);
      this.integrate(dt, scene);
      if (this.stateTime > 0.28) {
        this.state = "idle";
        this.clearActionSprite();
      }
      return;
    }

    if (this.state === "pulse") {
      this.vx = 0;
      if (!this.didStrike && this.stateTime > 0.16) {
        this.didStrike = true;
        engine.applyPulse(this);
      }
      if (this.stateTime > 0.54) {
        this.state = "idle";
        this.clearActionSprite();
      }
      return;
    }

    if (this.state === "grab") {
      if (!this.didStrike && this.stateTime > 0.12) {
        this.didStrike = true;
        engine.applyGrab(this);
      }
      if (this.stateTime > 0.38) {
        this.state = "idle";
        this.clearActionSprite();
      }
      return;
    }

    if (this.isAttacking()) {
      const strikeAt = this.currentAttack?.strikeAt ?? (this.state === "light" ? 0.1 : 0.22);
      const recoverAt = this.currentAttack?.recoverAt ?? (this.state === "light" ? 0.3 : 0.56);
      if (!this.didStrike && this.stateTime >= strikeAt) {
        this.didStrike = true;
        engine.applyPlayerAttack(this, this.attackKind || this.state);
      }
      this.vx = this.facing * (this.currentAttack?.advance ?? (this.state === "light" ? 36 : 58));
      this.integrate(dt, scene);
      if (this.stateTime >= recoverAt) {
        const next = this.queuedAttack;
        this.queuedAttack = null;
        this.queueBuffer = 0;
        this.state = "idle";
        this.clearActionSprite();
        if (next) this.startAttack(next, engine);
      }
    }
  }

  requestAttack(kind, engine) {
    if (this.isAttacking()) {
      if (this.stateTime > 0.08) {
        this.queuedAttack = kind;
        this.queueBuffer = 0.34;
        engine.fx.add("text", this.x + this.facing * 46, engine.screenY(this) - 112, {
          text: kind === "light" ? "chain" : "finish",
          color: "rgba(216, 207, 183, 0.86)",
          life: 0.22
        });
      }
      return;
    }
    this.startAttack(kind, engine);
  }

  startAttack(kind, engine) {
    if (this.state === "defeated" || this.state === "hit" || this.state === "pulse" || this.state === "grab") return;
    if (this.isAttacking()) return;
    const profile = buildPlayerAttackProfile(kind, {
      comboStep: this.comboStep,
      comboWindow: this.comboWindow
    });
    this.state = profile.state;
    this.stateTime = 0;
    this.attackId += 1;
    this.didStrike = false;
    this.attackKind = kind;
    this.spriteAssetId = profile.spriteAssetId || null;
    this.spriteState = profile.spriteState || null;
    this.currentAttack = profile;
    this.currentHit = profile.hit;
    if (profile.invulnerable) this.invulnerable = Math.max(this.invulnerable, profile.invulnerable);
    if (profile.comboStep) {
      this.comboStep = profile.comboStep;
      this.comboWindow = profile.comboWindow ?? 0.82;
      this.comboName = profile.name;
    } else {
      this.comboName = profile.name;
      this.comboWindow = profile.keepsWindow ? 0.58 : 0;
      this.comboStep = profile.keepsWindow ? this.comboStep : 0;
      this.cohesion = Math.max(0, this.cohesion - (profile.cohesionCost ?? 0));
    }
    engine.audio?.play(profile.sound || (profile.state === "light" ? "attackLight" : "attackHeavy"), profile.pitch ?? 0.9);
    const effectY = engine.screenY(this) - (profile.state === "air" ? 72 : 56);
    if (profile.state === "special") {
      engine.fx.add("shockwave", this.x, engine.screenY(this) - 42, {
        size: 118,
        color: "rgba(141, 47, 37, 0.75)",
        life: 0.5
      });
      engine.fx.add("smear", this.x, effectY, {
        color: "rgba(141, 47, 37, 0.42)",
        facing: this.facing,
        angle: -0.18,
        length: 250,
        thickness: 42,
        life: 0.34
      });
    } else {
      engine.fx.add("smear", this.x + this.facing * ((profile.hit?.reach ?? 100) * 0.38), effectY, {
        color: profile.state === "heavy" ? "rgba(211, 139, 62, 0.5)" : "rgba(216, 207, 183, 0.45)",
        facing: this.facing,
        angle: profile.state === "air" ? 0.45 : profile.state === "heavy" ? -0.2 : -0.05,
        length: profile.state === "heavy" ? 190 : 135,
        thickness: profile.state === "heavy" ? 28 : 18,
        life: profile.state === "heavy" ? 0.22 : 0.16
      });
    }
    if (profile.name === "shoulder" || profile.name === "root lift") {
      engine.fx.add("dust", this.x - this.facing * 20, engine.screenY(this) + 12, {
        color: "rgba(95, 77, 59, 0.55)",
        facing: -this.facing,
        size: profile.name === "root lift" ? 30 : 22,
        life: 0.38
      });
    }
    engine.fx.add("slash", this.x + this.facing * 56, engine.screenY(this), {
      size: profile.slashSize,
      color: profile.slashColor
    });
    if (profile.callout) {
      engine.fx.add("text", this.x + this.facing * 42, engine.screenY(this) - 95, {
        text: profile.callout,
        color: "#d38b3e",
        life: 0.34
      });
    }
  }

  buildAttackProfile(kind) {
    if (kind === "light") {
      const step = this.comboWindow > 0 ? Math.min(4, this.comboStep + 1) : 1;
      const profiles = {
        1: {
          name: "cut",
          state: "light",
          comboStep: 1,
          strikeAt: 0.09,
          recoverAt: 0.24,
          advance: 34,
          slashSize: 46,
          slashColor: "#d8cfb7",
          callout: null,
          sound: "attackLight",
          pitch: 0.92,
          hit: { damage: 14, reach: 86, knockback: 190, stun: false, laneWidth: 0.13 }
        },
        2: {
          name: "cross",
          state: "light",
          comboStep: 2,
          strikeAt: 0.1,
          recoverAt: 0.27,
          advance: 42,
          slashSize: 54,
          slashColor: "#d8cfb7",
          callout: "x2",
          sound: "attackLight",
          pitch: 1.02,
          hit: { damage: 17, reach: 96, knockback: 225, stun: false, laneWidth: 0.14 }
        },
        3: {
          name: "hook",
          state: "light",
          comboStep: 3,
          strikeAt: 0.11,
          recoverAt: 0.31,
          advance: 50,
          slashSize: 64,
          slashColor: "#d38b3e",
          callout: "x3",
          sound: "attackLight",
          pitch: 1.1,
          hit: { damage: 20, reach: 106, knockback: 260, stun: false, laneWidth: 0.16 }
        },
        4: {
          name: "sentence",
          state: "light",
          comboStep: 4,
          strikeAt: 0.13,
          recoverAt: 0.42,
          advance: 66,
          slashSize: 82,
          slashColor: "#d38b3e",
          callout: "sentence",
          sound: "attackHeavy",
          pitch: 1,
          hit: { damage: 28, reach: 124, knockback: 360, stun: true, laneWidth: 0.18 }
        }
      };
      return profiles[step];
    }

    if (kind === "dashLight") {
      return {
        name: "shoulder",
        state: "light",
        strikeAt: 0.08,
        recoverAt: 0.34,
        advance: 132,
        slashSize: 58,
        slashColor: "#d8cfb7",
        callout: "rush",
        keepsWindow: true,
        comboWindow: 0.72,
        sound: "attackLight",
        pitch: 1.08,
        spriteAssetId: "silvaActions",
        spriteState: "dashAttack",
        hit: { damage: 16, reach: 108, knockback: 285, stun: true, laneWidth: 0.16 }
      };
    }

    if (kind === "airLight") {
      return {
        name: "neutral air",
        state: "air",
        strikeAt: 0.08,
        recoverAt: 0.34,
        advance: 42,
        slashSize: 76,
        slashColor: "#d8cfb7",
        callout: "air",
        sound: "attackLight",
        pitch: 1.18,
        spriteAssetId: "silvaActions",
        spriteState: "airNeutral",
        hit: { damage: 21, reach: 116, knockback: 300, stun: true, launch: 180, laneWidth: 0.18 }
      };
    }

    if (kind === "airForward") {
      return {
        name: "forward air",
        state: "air",
        strikeAt: 0.08,
        recoverAt: 0.38,
        advance: 92,
        slashSize: 82,
        slashColor: "#d8cfb7",
        callout: "air in",
        sound: "attackLight",
        pitch: 1.22,
        spriteAssetId: "silvaActions",
        spriteState: "airForward",
        hit: { damage: 23, reach: 132, knockback: 330, stun: true, launch: 150, laneWidth: 0.18 }
      };
    }

    if (kind === "airDown") {
      return {
        name: "down air",
        state: "air",
        strikeAt: 0.1,
        recoverAt: 0.4,
        advance: 48,
        slashSize: 86,
        slashColor: "#d38b3e",
        callout: "down",
        sound: "attackHeavy",
        pitch: 1.02,
        spriteAssetId: "silvaActions",
        spriteState: "airDown",
        hit: { damage: 28, reach: 126, knockback: 250, stun: true, launch: 90, laneWidth: 0.2 }
      };
    }

    if (kind === "launcher") {
      return {
        name: "root lift",
        state: "heavy",
        strikeAt: 0.18,
        recoverAt: 0.5,
        advance: 42,
        slashSize: 88,
        slashColor: "#d38b3e",
        callout: "lift",
        cohesionCost: 5,
        sound: "attackHeavy",
        pitch: 0.95,
        spriteAssetId: "silvaActions",
        spriteState: "launcher",
        hit: { damage: 26, reach: 112, knockback: 210, stun: true, launch: 560, laneWidth: 0.18 }
      };
    }

    if (kind === "special" || kind === "specialDefensive") {
      return {
        name: "defensive special",
        state: "special",
        strikeAt: 0.18,
        recoverAt: 0.64,
        advance: 0,
        slashSize: 132,
        slashColor: "#d38b3e",
        callout: "guard",
        cohesionCost: 20,
        sound: "pulse",
        pitch: 1,
        invulnerable: 0.32,
        spriteAssetId: "silvaActions",
        spriteState: "specialDefensive",
        hit: { damage: 26, reach: 162, knockback: 340, stun: true, launch: 300, laneWidth: 0.28, allAround: true }
      };
    }

    if (kind === "specialOffensive") {
      return {
        name: "offensive special",
        state: "special",
        strikeAt: 0.16,
        recoverAt: 0.7,
        advance: 96,
        slashSize: 142,
        slashColor: "#d38b3e",
        callout: "sash",
        cohesionCost: 22,
        sound: "pulse",
        pitch: 1.08,
        spriteAssetId: "silvaActions",
        spriteState: "specialOffensive",
        hit: { damage: 36, reach: 205, knockback: 430, stun: true, launch: 330, laneWidth: 0.22 }
      };
    }

    if (kind === "airSpecial") {
      return {
        name: "air special",
        state: "special",
        strikeAt: 0.14,
        recoverAt: 0.58,
        advance: 64,
        slashSize: 128,
        slashColor: "#d38b3e",
        callout: "air sash",
        cohesionCost: 18,
        sound: "pulse",
        pitch: 1.12,
        spriteAssetId: "silvaActions",
        spriteState: "specialOffensive",
        hit: { damage: 30, reach: 178, knockback: 350, stun: true, launch: 260, laneWidth: 0.24 }
      };
    }

    const launcher = this.comboStep >= 2 && this.comboWindow > 0;
    if (launcher) {
      return {
        name: "breaker",
        state: "heavy",
        comboStep: this.comboStep,
        strikeAt: 0.2,
        recoverAt: this.comboStep >= 4 ? 0.64 : 0.56,
        advance: this.comboStep >= 4 ? 92 : 68,
        slashSize: this.comboStep >= 4 ? 110 : 90,
        slashColor: "#d38b3e",
        callout: this.comboStep >= 4 ? "sentence breaker" : "breaker",
        cohesionCost: this.comboStep >= 4 ? 10 : 8,
        keepsWindow: false,
        sound: "attackHeavy",
        pitch: this.comboStep >= 4 ? 1.1 : 1,
        spriteAssetId: "silvaActions",
        spriteState: "launcher",
        hit: {
          damage: this.comboStep >= 4 ? 48 : 38,
          reach: this.comboStep >= 4 ? 150 : 132,
          knockback: this.comboStep >= 4 ? 560 : 470,
          stun: true,
          launch: this.comboStep >= 4 ? 420 : 280,
          laneWidth: 0.2
        }
      };
    }

    return {
      name: "heavy",
      state: "heavy",
      comboStep: 0,
      strikeAt: 0.22,
      recoverAt: 0.56,
      advance: 58,
      slashSize: 78,
      slashColor: "#d38b3e",
      callout: "break",
      cohesionCost: 4,
      keepsWindow: false,
      hit: { damage: 30, reach: 122, knockback: 360, stun: true, laneWidth: 0.18 }
    };
  }

  trySpecial(engine, input) {
    if (this.isLocked() || this.cohesion < 20) {
      if (!this.isLocked()) {
        engine.fx.add("text", this.x, engine.screenY(this) - 92, {
          text: "low cohesion",
          color: "rgba(216, 207, 183, 0.8)",
          life: 0.36
        });
      }
      return;
    }
    const axisX = input?.axisX?.() ?? 0;
    const specialKind = this.z > 0 ? "airSpecial" : Math.abs(axisX) > 0 ? "specialOffensive" : "specialDefensive";
    if (axisX !== 0) this.facing = Math.sign(axisX);
    this.startAttack(specialKind, engine);
    engine.fx.shake(5);
  }

  tryPickup(engine) {
    if (this.isLocked()) return;
    engine.fx.add("text", this.x + this.facing * 36, engine.screenY(this) - 72, {
      text: "pickup slot",
      color: "rgba(216, 207, 183, 0.78)",
      life: 0.42
    });
  }

  tryStar(engine) {
    if (this.isLocked()) return;
    engine.fx.add("text", this.x, engine.screenY(this) - 112, {
      text: "star move placeholder",
      color: "#d38b3e",
      life: 0.62
    });
    engine.audio?.play("pulse", 0.7);
  }

  tryGrab(engine) {
    if (this.grabCooldown > 0 || this.isLocked()) return;
    this.state = "grab";
    this.stateTime = 0;
    this.didStrike = false;
    this.grabCooldown = 1.1;
    engine.fx.add("text", this.x + this.facing * 48, engine.screenY(this) - 65, {
      text: "contain",
      color: "#d8cfb7",
      life: 0.5
    });
  }

  tryPulse(engine) {
    if (this.pulseCooldown > 0 || this.cohesion < 28 || this.isLocked()) {
      if (!this.isLocked()) {
        engine.fx.add("text", this.x, engine.screenY(this) - 86, {
          text: this.cohesion < 28 ? "low cohesion" : "not ready",
          color: "rgba(216, 207, 183, 0.8)",
          life: 0.36
        });
      }
      return;
    }
    this.cohesion -= combatSystemRules.spirit.costs.pulse;
    this.pulseCooldown = 3.8;
    this.state = "pulse";
    this.stateTime = 0;
    this.didStrike = false;
    engine.fx.shake(7);
  }

  startDodge(direction, force = false) {
    if ((!force && this.isLocked()) || this.z > 0) return;
    this.facing = Math.sign(direction) || this.facing;
    this.state = "dodge";
    this.stateTime = 0;
    this.invulnerable = 0.32;
    this.clearActionSprite();
  }

  integrate(dt, scene) {
    this.x = clamp(this.x + this.vx * dt, scene.bounds.left, scene.bounds.right);
    this.lane = clamp(this.lane + this.vLane * dt, scene.bounds.topLane, scene.bounds.bottomLane);
    if (this.z > 0 || this.vz > 0) {
      this.vz -= 1180 * dt;
      this.z += this.vz * dt;
      if (this.z <= 0) {
        this.z = 0;
        this.vz = 0;
        if (this.state === "jump") {
          this.state = "idle";
          this.clearActionSprite();
        }
      }
    }
  }

  receiveHit(amount, fromX) {
    if (this.invulnerable > 0 || this.body <= 0) return false;
    this.body = Math.max(0, this.body - amount);
    this.state = this.body <= 0 ? "defeated" : "hit";
    this.stateTime = 0;
    this.hitFlash = 0.18;
    this.vx = fromX < this.x ? 180 : -180;
    this.invulnerable = 0.42;
    this.comboStep = 0;
    this.clearActionSprite();
    return true;
  }

  clearActionSprite() {
    this.attackKind = null;
    this.spriteAssetId = null;
    this.spriteState = null;
  }
}
