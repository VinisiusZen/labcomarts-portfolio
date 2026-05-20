const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function drawEnvironment(ctx, engine) {
  const { width, height, assets, scene, camera } = engine;
  const bg = scene.backgroundMode === "constructed" ? null : assets.image(scene.backgroundId);
  const bgRecord = assets.record(scene.backgroundId);
  if (bg) {
    drawBackgroundPlate(ctx, bg, width, height, camera, Boolean(bgRecord?.plate));
    if (bgRecord?.plate) {
      drawPlateAtmosphere(ctx, width, height, camera);
      return;
    }
  } else {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#071012");
    sky.addColorStop(0.56, "#0b1711");
    sky.addColorStop(1, "#17120d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#030505";
  for (let i = 0; i < 32; i += 1) {
    const x = ((i * 146 - camera.x * 0.34) % (width + 260)) - 140;
    const h = 145 + (i % 6) * 42;
    ctx.fillRect(x, height * 0.48 - h, 18 + (i % 3) * 9, h + 260);
    ctx.beginPath();
    ctx.arc(x + 12, height * 0.47 - h, 44 + (i % 4) * 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawConstructedRiver(ctx, engine);

  const laneTop = engine.laneToY(scene.bounds.topLane);
  const laneBottom = engine.laneToY(scene.bounds.bottomLane);
  const mud = ctx.createLinearGradient(0, laneTop, 0, laneBottom + 110);
  mud.addColorStop(0, "rgba(31, 25, 18, 0.64)");
  mud.addColorStop(0.46, "rgba(42, 33, 27, 0.94)");
  mud.addColorStop(1, "rgba(5, 11, 13, 0.98)");
  ctx.fillStyle = mud;
  ctx.beginPath();
  ctx.moveTo(0, laneTop - 38);
  for (let x = 0; x <= width + 80; x += 80) {
    ctx.lineTo(x, laneTop - 28 + Math.sin((x + camera.x * 0.25) * 0.01) * 13);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.46;
  ctx.strokeStyle = "#9aa9a3";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    const y = laneBottom + 32 + i * 28;
    ctx.beginPath();
    for (let x = -20; x <= width + 20; x += 70) {
      const wave = Math.sin((x + camera.x * 0.32 + i * 90) * 0.012) * 8;
      if (x === -20) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "#271d15";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i += 1) {
    const rootX = ((i * 280 - camera.x * 0.8) % (width + 420)) - 160;
    const y = laneTop + 78 + (i % 4) * 34;
    ctx.beginPath();
    ctx.moveTo(rootX, y);
    ctx.bezierCurveTo(rootX + 95, y - 34, rootX + 150, y + 38, rootX + 260, y - 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawConstructedRiver(ctx, engine) {
  const { width, height, camera } = engine;
  const laneTop = engine.laneToY(engine.scene.bounds.topLane);

  ctx.save();
  const moonX = width * 0.72 - camera.x * 0.025;
  const moonY = height * 0.18;
  const glow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, height * 0.42);
  glow.addColorStop(0, "rgba(176, 192, 201, 0.22)");
  glow.addColorStop(1, "rgba(176, 192, 201, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height * 0.72);
  ctx.fillStyle = "rgba(205, 214, 211, 0.72)";
  ctx.beginPath();
  ctx.arc(moonX, moonY, 28 * engine.worldScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const riverY = laneTop - height * 0.13;
  const river = ctx.createLinearGradient(0, riverY, 0, laneTop + 72);
  river.addColorStop(0, "rgba(3, 12, 17, 0.92)");
  river.addColorStop(0.58, "rgba(8, 21, 25, 0.88)");
  river.addColorStop(1, "rgba(5, 8, 8, 0.18)");
  ctx.fillStyle = river;
  ctx.beginPath();
  ctx.moveTo(0, riverY + 12);
  for (let x = -40; x <= width + 60; x += 90) {
    ctx.lineTo(x, riverY + Math.sin((x + camera.x * 0.1) * 0.012) * 10);
  }
  ctx.lineTo(width, laneTop + 95);
  ctx.lineTo(0, laneTop + 75);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.34;
  ctx.strokeStyle = "#aeb9b7";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 7; i += 1) {
    const y = riverY + 28 + i * 18;
    ctx.beginPath();
    for (let x = -30; x <= width + 30; x += 62) {
      const wave = Math.sin((x + camera.x * (0.16 + i * 0.02) + i * 80) * 0.018) * 4;
      if (x === -30) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlateAtmosphere(ctx, width, height, camera) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#a9b2ac";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 4; i += 1) {
    const y = height * (0.52 + i * 0.035);
    ctx.beginPath();
    for (let x = -30; x <= width + 30; x += 58) {
      const wave = Math.sin((x + camera.x * 0.16 + i * 80) * 0.014) * 5;
      if (x === -30) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 3; i += 1) {
    const x = ((i * 380 - camera.x * 0.06) % (width + 500)) - 160;
    const y = height * (0.5 + i * 0.035);
    const fog = ctx.createRadialGradient(x, y, 18, x, y, 190 + i * 30);
    fog.addColorStop(0, "rgba(150, 160, 158, 0.12)");
    fog.addColorStop(1, "rgba(150, 160, 158, 0)");
    ctx.fillStyle = fog;
    ctx.fillRect(x - 240, y - 80, 480, 160);
  }
  ctx.restore();
}

function drawBackgroundPlate(ctx, image, width, height, camera, isPlate) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > canvasRatio) {
    sourceWidth = image.height * canvasRatio;
    const maxPan = image.width - sourceWidth;
    sourceX = isPlate ? maxPan * 0.5 : (camera.x * 0.08) % Math.max(1, maxPan);
  } else {
    sourceHeight = image.width / canvasRatio;
    sourceY = (image.height - sourceHeight) * 0.5;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

  if (isPlate) {
    const laneShade = ctx.createLinearGradient(0, height * 0.42, 0, height);
    laneShade.addColorStop(0, "rgba(0, 0, 0, 0)");
    laneShade.addColorStop(0.68, "rgba(0, 0, 0, 0.08)");
    laneShade.addColorStop(1, "rgba(0, 0, 0, 0.28)");
    ctx.fillStyle = laneShade;
    ctx.fillRect(0, 0, width, height);
  }
}

export function drawSceneProps(ctx, engine, layer) {
  const props = engine.scene.props || [];
  for (const prop of props.filter((item) => (item.layer || "back") === layer)) {
    drawSceneProp(ctx, engine, prop);
  }
}

function drawSceneProp(ctx, engine, prop) {
  const image = engine.assets.image(prop.atlasId);
  const atlas = engine.assets.record(prop.atlasId)?.atlas;
  const rect = atlas?.[prop.propId];
  if (!image || !rect) return;

  const scale = (prop.scale ?? 1) * engine.worldScale;
  const width = rect.w * scale;
  const height = rect.h * scale;
  const parallax = prop.parallax ?? 1;
  const x = prop.x - engine.camera.x * parallax;
  const y = engine.laneToY(prop.lane ?? 0.72) + (prop.offsetY ?? 0) * engine.worldScale;
  if (x + width < -120 || x - width > engine.width + 120) return;

  ctx.save();
  ctx.globalAlpha = prop.alpha ?? 1;
  ctx.translate(x, y);
  if (prop.flip) ctx.scale(-1, 1);
  ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, -width * 0.5, -height, width, height);
  ctx.restore();
}

export function drawActor(ctx, actor, engine, kind = "player") {
  const x = actor.x - engine.camera.x;
  const y = engine.screenY(actor);
  const scale = (0.82 + actor.lane * 0.44) * engine.worldScale;
  const width = actor.width * scale;
  const height = actor.height * scale;
  const alpha = actor.state === "defeated" ? clamp(1 - actor.defeatTimer / 1.2, 0.2, 1) : 1;
  const playerActionState = actor.state === "run" ? "dashMove" : actor.state === "jump" ? "jump" : actor.spriteState;
  const usesActionSheet = actor.state === "run" || actor.state === "jump";
  const assetId = kind === "player" ? actor.spriteAssetId || (usesActionSheet ? "silvaActions" : "silva") : actor.assetId;
  const renderState = kind === "player" ? playerActionState || actor.state : actor.state;
  const image = engine.assets.image(assetId);
  const assetRecord = engine.assets.record(assetId);

  ctx.save();
  ctx.globalAlpha = alpha;
  if (actor.invulnerable > 0 && Math.floor(actor.invulnerable * 28) % 2 === 0) ctx.globalAlpha *= 0.55;
  ctx.translate(x, y - actor.z);
  ctx.scale(actor.facing, 1);

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.ellipse(0, actor.z + 8, width * 0.52, 13 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  if (image && assetRecord?.sheet) {
    if (kind === "player" && ["light", "heavy", "special", "air", "dodge"].includes(actor.state)) {
      ctx.save();
      ctx.globalAlpha *= actor.state === "special" ? 0.28 : 0.18;
      ctx.globalCompositeOperation = actor.state === "special" ? "screen" : "source-over";
      ctx.translate(-22 * scale, 0);
      drawSpriteFrame(ctx, image, assetRecord.sheet, actor, width, height, scale, renderState);
      ctx.restore();
    }
    drawSpriteFrame(ctx, image, assetRecord.sheet, actor, width, height, scale, renderState);
  } else if (image) {
    const flash = actor.hitFlash > 0;
    ctx.filter = flash ? "brightness(2.4) sepia(0.6)" : "none";
    ctx.drawImage(image, -width * 0.56, -height, width * 1.12, height);
  } else {
    drawFallbackSilhouette(ctx, actor, width, height, kind);
  }

  if (kind === "player" && !assetRecord?.sheet) drawSilvaDetails(ctx, actor, width, height, scale);
  if (kind !== "player" && actor.state === "attack") drawAttackTell(ctx, actor, width, height, scale);
  if (kind !== "player") drawEnemyBars(ctx, actor, width, height);
  ctx.restore();
}

function drawAttackTell(ctx, actor, width, height, scale) {
  const progress = Math.min(1, actor.stateTime / Math.max(0.1, actor.attackWindup));
  ctx.save();
  ctx.globalAlpha = 0.25 + progress * 0.35;
  ctx.strokeStyle = actor.elite ? "#d38b3e" : "#c98d70";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(0, -height * 0.45, width * (0.5 + progress * 0.2), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSpriteFrame(ctx, image, sheet, actor, width, height, scale, renderState = actor.state) {
  const flash = actor.hitFlash > 0;
  const animation = sheet.animations[renderState] || sheet.animations[actor.state] || sheet.animations.idle;
  const rawIndex = Math.floor(actor.stateTime * animation.fps);
  const frameSlot = animation.loop
    ? animation.frames[rawIndex % animation.frames.length]
    : animation.frames[Math.min(animation.frames.length - 1, rawIndex)];
  const baseSpriteSize = height * 1.34;
  const inset = sheet.sourceInset ?? 5;
  const nominalFrameWidth = sheet.nominalFrameWidth ?? sheet.frameWidth;
  const nominalFrameHeight = sheet.nominalFrameHeight ?? sheet.frameHeight;
  const scaleX = baseSpriteSize / nominalFrameWidth;
  const scaleY = baseSpriteSize / nominalFrameHeight;
  const sourcePadX = Math.max(0, (sheet.frameWidth - nominalFrameWidth) * 0.5 - inset);
  const sourcePadY = Math.max(0, (sheet.frameHeight - nominalFrameHeight) * 0.5 - inset);
  const sx = frameSlot * sheet.frameWidth + inset;
  const sy = animation.row * sheet.frameHeight + inset;
  const sw = sheet.frameWidth - inset * 2;
  const sh = sheet.frameHeight - inset * 2;
  const drawWidth = sw * scaleX;
  const drawHeight = sh * scaleY;
  const dx = -baseSpriteSize * 0.52 - sourcePadX * scaleX;
  const dy = -baseSpriteSize + 10 * scale - sourcePadY * scaleY;
  const clipPad = Math.max(baseSpriteSize * 0.04, drawWidth * 0.025);

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx - clipPad, dy - clipPad, drawWidth + clipPad * 2, drawHeight + clipPad * 2);
  ctx.clip();
  ctx.filter = flash ? "brightness(2.25) sepia(0.55)" : "none";
  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    dx,
    dy,
    drawWidth,
    drawHeight
  );
  ctx.filter = "none";
  ctx.restore();
}

function drawFallbackSilhouette(ctx, actor, width, height, kind) {
  ctx.fillStyle = kind === "player" ? "#140f0c" : actor.tint;
  ctx.beginPath();
  ctx.ellipse(0, -height + 28, width * 0.25, height * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-width * 0.32, -height + 58, width * 0.64, height * 0.54);
  ctx.fillRect(-width * 0.35, -height * 0.3, width * 0.22, height * 0.32);
  ctx.fillRect(width * 0.13, -height * 0.3, width * 0.22, height * 0.32);
}

function drawSilvaDetails(ctx, actor, width, height, scale) {
  ctx.strokeStyle = "#0a0807";
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo((-12 + i * 6) * scale, -height + 22);
    ctx.bezierCurveTo(-18 * scale, -height * 0.68, 22 * scale, -height * 0.48, (12 + i * 8) * scale, -height * 0.1);
    ctx.stroke();
  }

  ctx.strokeStyle = "#d8cfb7";
  ctx.lineWidth = 18 * scale;
  ctx.beginPath();
  ctx.moveTo(-width * 0.38, -height * 0.43);
  ctx.quadraticCurveTo(0, -height * 0.36, width * 0.4, -height * 0.43);
  ctx.stroke();

  ctx.strokeStyle = "#8d2f25";
  ctx.lineWidth = 6 * scale;
  ctx.beginPath();
  ctx.moveTo(-width * 0.36, -height * 0.4);
  ctx.quadraticCurveTo(0, -height * 0.34, width * 0.38, -height * 0.4);
  ctx.stroke();

  ctx.fillStyle = "#c7c1ae";
  const macheteLift = actor.state === "heavy" ? -height * 0.22 : -height * 0.35;
  ctx.beginPath();
  ctx.moveTo(width * 0.18, -height * 0.55);
  ctx.lineTo(width * 0.86, macheteLift);
  ctx.lineTo(width * 0.82, macheteLift + 16 * scale);
  ctx.lineTo(width * 0.2, -height * 0.45);
  ctx.closePath();
  ctx.fill();
}

function drawEnemyBars(ctx, actor, width, height) {
  if (actor.body <= 0) return;
  const pct = actor.body / actor.maxBody;
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(-width * 0.45, -height - 16, width * 0.9, 5);
  ctx.fillStyle = actor.elite ? "#d38b3e" : "#8d2f25";
  ctx.fillRect(-width * 0.45, -height - 16, width * 0.9 * pct, 5);
}

export function drawHitbox(ctx, hitbox, engine) {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#d38b3e";
  ctx.fillRect(hitbox.x - engine.camera.x, hitbox.y, hitbox.w, hitbox.h);
  ctx.restore();
}
