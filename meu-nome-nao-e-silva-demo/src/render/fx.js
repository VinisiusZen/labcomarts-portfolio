export class FxLayer {
  constructor() {
    this.items = [];
    this.cameraShake = 0;
    this.hitStop = 0;
  }

  add(type, x, y, options = {}) {
    this.items.push({
      type,
      x,
      y,
      age: 0,
      life: options.life ?? 0.42,
      size: options.size ?? 42,
      color: options.color ?? "#d38b3e",
      text: options.text ?? "",
      facing: options.facing ?? 1,
      angle: options.angle ?? 0,
      length: options.length ?? 120,
      thickness: options.thickness ?? 22
    });
  }

  shake(amount = 8) {
    this.cameraShake = Math.max(this.cameraShake, amount);
  }

  stop(duration = 0.06) {
    this.hitStop = Math.max(this.hitStop, duration);
  }

  update(dt) {
    this.hitStop = Math.max(0, this.hitStop - dt);
    this.cameraShake *= Math.pow(0.02, dt);
    this.items = this.items.filter((item) => {
      item.age += dt;
      return item.age < item.life;
    });
  }

  draw(ctx, camera) {
    for (const item of this.items) {
      const progress = item.age / item.life;
      const alpha = 1 - progress;
      const x = item.x - camera.x;
      const y = item.y;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (item.type === "slash") {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 7 * alpha;
        ctx.beginPath();
        ctx.arc(x, y, item.size * (0.7 + progress), -0.6, 0.72);
        ctx.stroke();
      }
      if (item.type === "smear") {
        ctx.translate(x, y);
        ctx.scale(item.facing, 1);
        ctx.rotate(item.angle);
        const gradient = ctx.createLinearGradient(-item.length * 0.2, 0, item.length, 0);
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.3, item.color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(item.length * 0.28, 0, item.length * (0.52 + progress * 0.14), item.thickness * alpha, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (item.type === "shockwave") {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 4 * alpha;
        ctx.beginPath();
        ctx.ellipse(x, y, item.size * (0.62 + progress * 1.3), item.size * (0.14 + progress * 0.32), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (item.type === "dust") {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.ellipse(x + item.facing * progress * 28, y - progress * 12, item.size * (0.8 + progress), item.size * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (item.type === "impact") {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.ellipse(x, y, item.size * (1 + progress), item.size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, item.size * (0.3 + progress), 0, Math.PI * 2);
        ctx.stroke();
      }
      if (item.type === "text") {
        ctx.fillStyle = item.color;
        ctx.font = "700 18px Georgia";
        ctx.fillText(item.text, x, y - progress * 34);
      }
      ctx.restore();
    }
  }
}
