export const enemyClasses = {
  hunter: {
    id: "hunter",
    displayName: "Hunter",
    faction: "Captains of the mato",
    role: "Pursuit-focused pressure unit",
    body: 58,
    speed: 128,
    depthSpeed: 88,
    reach: 54,
    damage: 8,
    attackWindup: 0.34,
    attackCooldown: 1.15,
    hitStun: 0.34,
    knockback: 178,
    tint: "#3a2a1f",
    assetId: "hunter",
    behavior: {
      flankDistance: 76,
      aggression: 0.74
    }
  },
  captain: {
    id: "captain",
    displayName: "Mato Captain",
    faction: "Captains of the mato",
    role: "Fast pressure leader with longer blade reach",
    body: 76,
    speed: 146,
    depthSpeed: 96,
    reach: 66,
    damage: 10,
    attackWindup: 0.3,
    attackCooldown: 1.0,
    hitStun: 0.28,
    knockback: 205,
    tint: "#2f241d",
    assetId: "captain",
    behavior: {
      flankDistance: 88,
      aggression: 0.86
    }
  },
  brute: {
    id: "brute",
    displayName: "Overseer Brute",
    faction: "Punishment apparatus",
    role: "Heavy melee unit that holds ground and punishes whiffs",
    body: 112,
    speed: 92,
    depthSpeed: 62,
    reach: 76,
    damage: 14,
    attackWindup: 0.44,
    attackCooldown: 1.36,
    hitStun: 0.22,
    knockback: 128,
    tint: "#4a3628",
    assetId: "brute",
    behavior: {
      flankDistance: 52,
      aggression: 0.64
    }
  },
  enforcer: {
    id: "enforcer",
    displayName: "Overseer Enforcer",
    faction: "Punishment apparatus",
    role: "Slow, disciplined violence",
    body: 132,
    speed: 82,
    depthSpeed: 58,
    reach: 68,
    damage: 15,
    attackWindup: 0.52,
    attackCooldown: 1.55,
    hitStun: 0.24,
    knockback: 105,
    tint: "#4b3425",
    assetId: "enforcer",
    behavior: {
      flankDistance: 44,
      aggression: 0.58
    }
  }
};
