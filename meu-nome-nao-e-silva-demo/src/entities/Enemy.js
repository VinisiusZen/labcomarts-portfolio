const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

let nextEnemyId = 1;

export class Enemy {
  constructor(config, spawn) {
    this.id = nextEnemyId++;
    this.enemyClass = config.id;
    this.displayName = config.displayName;
    this.role = config.role;
    this.faction = config.faction;
    this.x = spawn.x;
    this.lane = spawn.lane;
    this.z = 0;
    this.vz = 0;
    this.vx = 0;
    this.facing = -1;
    this.body = spawn.elite ? Math.round(config.body * 1.35) : config.body;
    this.maxBody = this.body;
    this.speed = spawn.elite ? config.speed * 0.92 : config.speed;
    this.depthSpeed = config.depthSpeed;
    this.reach = config.reach;
    this.damage = spawn.elite ? Math.round(config.damage * 1.3) : config.damage;
    this.attackWindup = config.attackWindup;
    this.attackCooldown = config.attackCooldown;
    this.hitStun = config.hitStun;
    this.knockback = config.knockback;
    this.tint = config.tint;
    this.assetId = config.assetId;
    this.behavior = config.behavior;
    this.elite = Boolean(spawn.elite);
    this.width = this.elite ? 86 : 68;
    this.height = this.elite ? 138 : 122;
    this.state = "enter";
    this.stateTime = 0;
    this.attackTimer = 0.6 + Math.random() * 0.6;
    this.didStrike = false;
    this.hitFlash = 0;
    this.defeatTimer = 0;
  }

  update(dt, player, scene, engine) {
    this.stateTime += dt;
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);

    if (this.state === "defeated") {
      this.defeatTimer += dt;
      this.vx *= Math.pow(0.02, dt);
      this.integrate(dt, scene);
      return;
    }

    if (this.state === "launched") {
      this.vx *= Math.pow(0.08, dt);
      this.integrate(dt, scene);
      if (this.z <= 0 && this.stateTime >= 0.24) {
        this.state = "stunned";
        this.stateTime = 0;
      }
      return;
    }

    if (this.state === "hit" || this.state === "stunned") {
      this.vx *= Math.pow(0.03, dt);
      this.integrate(dt, scene);
      const recover = this.state === "stunned" ? 1.1 : this.hitStun;
      if (this.stateTime >= recover) this.state = "chase";
      return;
    }

    if (this.state === "attack") {
      this.vx = 0;
      if (!this.didStrike && this.stateTime >= this.attackWindup) {
        this.didStrike = true;
        engine.applyEnemyAttack(this, player);
      }
      if (this.stateTime >= this.attackCooldown) {
        this.state = "chase";
        this.stateTime = 0;
        this.attackTimer = 0.45 + Math.random() * 0.8;
      }
      return;
    }

    const dx = player.x - this.x;
    const laneDelta = player.lane - this.lane;
    this.facing = dx < 0 ? -1 : 1;

    const canAttack = Math.abs(dx) <= this.reach && Math.abs(laneDelta) < 0.115 && this.attackTimer <= 0;
    if (canAttack) {
      this.state = "attack";
      this.stateTime = 0;
      this.didStrike = false;
      engine.fx.add("text", this.x, engine.screenY(this) - this.height * 0.82, {
        text: this.elite ? "punish" : "strike",
        color: this.elite ? "#d38b3e" : "#c98d70",
        life: this.attackWindup + 0.16
      });
      return;
    }

    this.state = "chase";
    const desiredGap = this.behavior.flankDistance + (this.id % 2) * 22;
    const targetX = player.x - this.facing * desiredGap;
    const moveX = Math.sign(targetX - this.x);
    const moveLane = Math.sign(laneDelta);
    this.vx = moveX * this.speed;
    this.lane = clamp(this.lane + moveLane * this.depthSpeed * dt * 0.006, scene.bounds.topLane, scene.bounds.bottomLane);
    this.integrate(dt, scene);
  }

  integrate(dt, scene) {
    this.x = clamp(this.x + this.vx * dt, scene.bounds.left, scene.bounds.right);
    if (this.z > 0 || this.vz > 0) {
      this.vz -= 980 * dt;
      this.z += this.vz * dt;
      if (this.z <= 0) {
        this.z = 0;
        this.vz = 0;
      }
    }
  }

  receiveHit(hit) {
    if (this.state === "defeated") return false;
    this.body = Math.max(0, this.body - hit.damage);
    this.hitFlash = 0.16;
    this.vx = hit.facing * hit.knockback;
    const launched = Boolean(hit.launch);
    if (launched) {
      this.z = Math.max(this.z, 22);
      this.vz = Math.max(this.vz, hit.launch);
    }
    if (this.body <= 0) {
      this.state = "defeated";
      this.stateTime = 0;
      this.defeatTimer = 0;
    } else {
      this.state = launched ? "launched" : hit.stun ? "stunned" : "hit";
      this.stateTime = 0;
    }
    return true;
  }
}
