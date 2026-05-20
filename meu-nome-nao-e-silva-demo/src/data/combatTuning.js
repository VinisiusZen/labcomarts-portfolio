const FRAME = 1 / 60;

const seconds = (frames) => Number((frames * FRAME).toFixed(4));

const frameWindow = ({ startup, active, recovery }) => ({
  startup,
  active,
  recovery,
  strikeAt: seconds(startup),
  activeUntil: seconds(startup + active),
  recoverAt: seconds(startup + active + recovery)
});

export const combatTimingFamilies = {
  idle: { frames: "6-8", fps: "8-10", note: "Hold pose, breathing, subtle secondary motion." },
  locomotion: { frames: "8-10", fps: "10-14", note: "Run should read smoother and more urgent than walk." },
  lightCombo: { frames: "4-6 per hit", fps: "12-16", note: "Fast confirms with clear contact frames." },
  heavyLauncher: { frames: "6-8", fps: "12-16", note: "Use frame hold before and after impact." },
  air: { frames: "3-6 per substate", fps: "12-14", note: "Short, readable, functional movement." },
  hitReaction: { frames: "3-7", fps: "10-14", note: "Weight and honest recovery matter more than smoothness." },
  special: { frames: "6-10", fps: "14-18", note: "Use higher FPS only around the active spiritual beat." }
};

export const protagonistStateMachine = {
  locomotion: [
    "idle",
    "walk",
    "run",
    "turn",
    "crouch",
    "jump_start",
    "jump_rise",
    "jump_apex",
    "jump_fall",
    "landing",
    "dash_start",
    "dash_travel",
    "dash_stop"
  ],
  attacks: ["light_1", "light_2", "light_3", "heavy", "launcher", "dash_attack", "air_slash"],
  utility: ["grab_start", "grab_hold", "throw", "dodge", "intimidate"],
  reactions: ["hit_light", "hit_heavy", "stagger", "knockback", "knockdown", "grounded", "get_up"],
  spirit: ["spirit_pulse_start", "spirit_pulse_active", "spirit_pulse_recovery", "red_sash_start", "red_sash_active", "red_sash_recovery", "rupture"]
};

export const enemyStateMachine = [
  "idle",
  "patrol",
  "alert",
  "pursuit",
  "engage",
  "attack_start",
  "attack_active",
  "attack_recovery",
  "hit_light",
  "hit_heavy",
  "stagger",
  "launched_airborne",
  "grounded",
  "get_up",
  "fear_hesitate",
  "fear_retreat",
  "defeated"
];

export const combatSystemRules = {
  spirit: {
    hudName: "Cohesion",
    comment: "Spirit is cohesion and rupture pressure, not generic mana.",
    gain: { lightHit: 3, heavyHit: 1, grab: 8, sentenceNonLethal: 10, intimidateSuccess: 5 },
    costs: { launcher: 5, breaker: 8, breakerFinisher: 10, defensiveSpecial: 20, offensiveSpecial: 22, airSpecial: 18, pulse: 28, dodgeCancel: 6 }
  },
  sentence: {
    enabled: false,
    windowStates: ["stunned", "grounded", "grabbed", "fear_hesitate"],
    lowBodyThreshold: 0.22,
    lethalHumanityCost: 4,
    nonLethalHumanityGain: 1,
    comment: "Next implementation: valid enemy enters sentence_window; player chooses lethal or non-lethal resolution."
  },
  humanity: {
    enabled: false,
    startingValue: 100,
    min: 0,
    max: 100,
    comment: "Macro variable for rupture and long-term narrative response; not a central combat HUD bar yet."
  },
  fear: {
    enabled: false,
    sources: { sentence: 28, ruptureSpecial: 22, intimidate: 18, eliteDefeated: 20, pulse: 10 },
    classResistance: { hunter: 0.8, captain: 0.58, brute: 0.35, enforcer: 0.25 },
    thresholds: { hesitate: 30, retreat: 65, returnWithReinforcements: 80 },
    comment: "Fear should alter behavior without freezing AI loops."
  },
  drops: {
    enabled: false,
    maxItemsInArena: 3,
    maxFoodPerEncounter: 3,
    oneDropPerEnemy: true,
    comment: "Every enemy needs dropConsumed to prevent farming the same body."
  },
  hunger: {
    enabled: false,
    layer: "macro",
    states: ["fed", "neutral", "weak", "exhausted"],
    comment: "Campaign/body condition layer; avoid constant combat drain in this prototype."
  }
};

export const playerFrameData = {
  light1: {
    id: "light1",
    label: "Light 1",
    command: "A",
    ...frameWindow({ startup: 4, active: 3, recovery: 8 }),
    onHit: "+2",
    onMiss: "-3",
    cancelTo: ["light2"],
    note: "Entrada simples, confirmavel."
  },
  light2: {
    id: "light2",
    label: "Light 2",
    command: "A, A",
    ...frameWindow({ startup: 5, active: 3, recovery: 10 }),
    onHit: "+1",
    onMiss: "-4",
    cancelTo: ["light3", "dash_attack"],
    note: "Continua pressao sem virar cancel livre."
  },
  light3: {
    id: "light3",
    label: "Light 3",
    command: "A, A, A",
    ...frameWindow({ startup: 6, active: 4, recovery: 14 }),
    onHit: "light knockdown",
    onMiss: "-6",
    cancelTo: ["red_sash_special"],
    note: "Fecha string curta."
  },
  light4: {
    id: "light4",
    label: "Sentence Chain Finisher",
    command: "A, A, A, A",
    ...frameWindow({ startup: 7, active: 5, recovery: 17 }),
    onHit: "stagger / sentence pressure",
    onMiss: "-8",
    cancelTo: [],
    note: "Prototype-only fourth hit that previews the Sentenca fantasy."
  },
  heavy: {
    id: "heavy",
    label: "Heavy",
    command: "Heavy",
    ...frameWindow({ startup: 10, active: 4, recovery: 18 }),
    onHit: "stagger",
    onMiss: "0 vs armor / punishable",
    cancelTo: [],
    note: "High weight, real risk."
  },
  launcher: {
    id: "launcher",
    label: "Launcher",
    command: "Down + Heavy",
    ...frameWindow({ startup: 12, active: 3, recovery: 20 }),
    onHit: "launch",
    onMiss: "-8",
    cancelTo: ["jump", "air_slash"],
    note: "Abre juggle curto e legivel."
  },
  dashAttack: {
    id: "dashAttack",
    label: "Dash Attack",
    command: "Run + A",
    ...frameWindow({ startup: 8, active: 4, recovery: 16 }),
    onHit: "light knockback",
    onMiss: "-6",
    cancelTo: [],
    note: "Fuga convertida em ofensiva."
  },
  airSlash: {
    id: "airSlash",
    label: "Air Slash",
    command: "Jump + A",
    ...frameWindow({ startup: 6, active: 4, recovery: 8 }),
    onHit: "air hit / juggle",
    onMiss: "height dependent",
    cancelTo: [],
    note: "Golpe de oportunidade; evitar leitura acrobatica demais."
  },
  grabStart: {
    id: "grabStart",
    label: "Grab Start",
    command: "Grab / close contact",
    ...frameWindow({ startup: 7, active: 8, recovery: 12 }),
    onHit: "grab_hold",
    onMiss: "whiff punishable",
    cancelTo: ["throw", "sentence"],
    note: "Inversao da captura."
  },
  throw: {
    id: "throw",
    label: "Throw",
    command: "Grab + direction + A",
    ...frameWindow({ startup: 5, active: 1, recovery: 18 }),
    onHit: "hard knockdown",
    onMiss: "N/A",
    cancelTo: [],
    note: "Crowd control and Sentenca feeder."
  },
  spiritPulse: {
    id: "spiritPulse",
    label: "Spirit Pulse",
    command: "Pulse",
    ...frameWindow({ startup: 14, active: 6, recovery: 22 }),
    onHit: "burst / fear",
    onMiss: "-10",
    cancelTo: [],
    note: "Consumes cohesion and pushes nearby threats."
  },
  redSashSpecial: {
    id: "redSashSpecial",
    label: "Red Sash Special",
    command: "Forward + Special",
    ...frameWindow({ startup: 16, active: 8, recovery: 24 }),
    onHit: "mark / stagger / pull",
    onMiss: "-12",
    cancelTo: [],
    note: "Iconic identity-as-weapon beat."
  }
};

export function buildPlayerAttackProfile(kind, context = {}) {
  const comboStep = context.comboWindow > 0 ? Math.min(4, (context.comboStep || 0) + 1) : 1;

  if (kind === "light") {
    const profiles = {
      1: {
        frameDataId: "light1",
        name: "cut",
        state: "light",
        comboStep: 1,
        advance: 34,
        slashSize: 46,
        slashColor: "#d8cfb7",
        callout: null,
        sound: "attackLight",
        pitch: 0.92,
        spriteAssetId: "silvaBasicAttack",
        spriteState: "light",
        strikeAt: 0.13,
        recoverAt: 0.28,
        hit: { damage: 14, reach: 86, knockback: 190, stun: false, laneWidth: 0.13 }
      },
      2: {
        frameDataId: "light2",
        name: "cross",
        state: "light",
        comboStep: 2,
        advance: 42,
        slashSize: 54,
        slashColor: "#d8cfb7",
        callout: "x2",
        sound: "attackLight",
        pitch: 1.02,
        spriteAssetId: "silvaBasicAttack",
        spriteState: "light",
        strikeAt: 0.13,
        recoverAt: 0.3,
        hit: { damage: 17, reach: 96, knockback: 225, stun: false, laneWidth: 0.14 }
      },
      3: {
        frameDataId: "light3",
        name: "hook",
        state: "light",
        comboStep: 3,
        advance: 50,
        slashSize: 64,
        slashColor: "#d38b3e",
        callout: "x3",
        sound: "attackLight",
        pitch: 1.1,
        spriteAssetId: "silvaBasicAttack",
        spriteState: "light",
        strikeAt: 0.13,
        recoverAt: 0.32,
        hit: { damage: 20, reach: 106, knockback: 260, stun: false, laneWidth: 0.16 }
      },
      4: {
        frameDataId: "light4",
        name: "sentence",
        state: "light",
        comboStep: 4,
        advance: 66,
        slashSize: 82,
        slashColor: "#d38b3e",
        callout: "sentence",
        sound: "attackHeavy",
        pitch: 1,
        spriteAssetId: "silvaBasicAttack",
        spriteState: "light",
        strikeAt: 0.13,
        recoverAt: 0.36,
        hit: { damage: 28, reach: 124, knockback: 360, stun: true, laneWidth: 0.18 }
      }
    };
    return withFrameData(profiles[comboStep]);
  }

  if (kind === "dashLight") {
    return withFrameData({
      frameDataId: "dashAttack",
      name: "shoulder",
      state: "light",
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
    });
  }

  if (kind === "airLight" || kind === "airForward" || kind === "airDown") {
    const airProfiles = {
      airLight: {
        name: "neutral air",
        advance: 42,
        slashSize: 76,
        slashColor: "#d8cfb7",
        callout: "air",
        pitch: 1.18,
        spriteState: "airNeutral",
        hit: { damage: 21, reach: 116, knockback: 300, stun: true, launch: 180, laneWidth: 0.18 }
      },
      airForward: {
        name: "forward air",
        advance: 92,
        slashSize: 82,
        slashColor: "#d8cfb7",
        callout: "air in",
        pitch: 1.22,
        spriteState: "airForward",
        hit: { damage: 23, reach: 132, knockback: 330, stun: true, launch: 150, laneWidth: 0.18 }
      },
      airDown: {
        name: "down air",
        advance: 48,
        slashSize: 86,
        slashColor: "#d38b3e",
        callout: "down",
        sound: "attackHeavy",
        pitch: 1.02,
        spriteState: "airDown",
        hit: { damage: 28, reach: 126, knockback: 250, stun: true, launch: 90, laneWidth: 0.2 }
      }
    };
    return withFrameData({
      frameDataId: "airSlash",
      state: "air",
      sound: "attackLight",
      spriteAssetId: "silvaActions",
      ...airProfiles[kind]
    });
  }

  if (kind === "launcher") {
    return withFrameData({
      frameDataId: "launcher",
      name: "root lift",
      state: "heavy",
      advance: 42,
      slashSize: 88,
      slashColor: "#d38b3e",
      callout: "lift",
      cohesionCost: combatSystemRules.spirit.costs.launcher,
      sound: "attackHeavy",
      pitch: 0.95,
      spriteAssetId: "silvaActions",
      spriteState: "launcher",
      hit: { damage: 26, reach: 112, knockback: 210, stun: true, launch: 560, laneWidth: 0.18 }
    });
  }

  if (kind === "special" || kind === "specialDefensive") {
    return withFrameData({
      frameDataId: "spiritPulse",
      name: "defensive special",
      state: "special",
      advance: 0,
      slashSize: 132,
      slashColor: "#d38b3e",
      callout: "guard",
      cohesionCost: combatSystemRules.spirit.costs.defensiveSpecial,
      sound: "pulse",
      pitch: 1,
      invulnerable: 0.32,
      spriteAssetId: "silvaActions",
      spriteState: "specialDefensive",
      hit: { damage: 26, reach: 162, knockback: 340, stun: true, launch: 300, laneWidth: 0.28, allAround: true }
    });
  }

  if (kind === "specialOffensive") {
    return withFrameData({
      frameDataId: "redSashSpecial",
      name: "offensive special",
      state: "special",
      advance: 96,
      slashSize: 142,
      slashColor: "#d38b3e",
      callout: "sash",
      cohesionCost: combatSystemRules.spirit.costs.offensiveSpecial,
      sound: "pulse",
      pitch: 1.08,
      spriteAssetId: "silvaActions",
      spriteState: "specialOffensive",
      hit: { damage: 36, reach: 205, knockback: 430, stun: true, launch: 330, laneWidth: 0.22 }
    });
  }

  if (kind === "airSpecial") {
    return withFrameData({
      frameDataId: "redSashSpecial",
      name: "air special",
      state: "special",
      advance: 64,
      slashSize: 128,
      slashColor: "#d38b3e",
      callout: "air sash",
      cohesionCost: combatSystemRules.spirit.costs.airSpecial,
      sound: "pulse",
      pitch: 1.12,
      spriteAssetId: "silvaActions",
      spriteState: "specialOffensive",
      hit: { damage: 30, reach: 178, knockback: 350, stun: true, launch: 260, laneWidth: 0.24 }
    });
  }

  const breaker = (context.comboStep || 0) >= 2 && context.comboWindow > 0;
  if (breaker) {
    const finisher = context.comboStep >= 4;
    return withFrameData({
      frameDataId: "launcher",
      name: "breaker",
      state: "heavy",
      comboStep: context.comboStep,
      advance: finisher ? 92 : 68,
      slashSize: finisher ? 110 : 90,
      slashColor: "#d38b3e",
      callout: finisher ? "sentence breaker" : "breaker",
      cohesionCost: finisher ? combatSystemRules.spirit.costs.breakerFinisher : combatSystemRules.spirit.costs.breaker,
      keepsWindow: false,
      sound: "attackHeavy",
      pitch: finisher ? 1.1 : 1,
      spriteAssetId: "silvaActions",
      spriteState: "launcher",
      hit: {
        damage: finisher ? 48 : 38,
        reach: finisher ? 150 : 132,
        knockback: finisher ? 560 : 470,
        stun: true,
        launch: finisher ? 420 : 280,
        laneWidth: 0.2
      }
    });
  }

  return withFrameData({
    frameDataId: "heavy",
    name: "heavy",
    state: "heavy",
    comboStep: 0,
    advance: 58,
    slashSize: 78,
    slashColor: "#d38b3e",
    callout: "break",
    cohesionCost: 4,
    keepsWindow: false,
    hit: { damage: 30, reach: 122, knockback: 360, stun: true, laneWidth: 0.18 }
  });
}

function withFrameData(profile) {
  const frameData = playerFrameData[profile.frameDataId] || playerFrameData.heavy;
  return {
    ...frameData,
    ...profile,
    strikeAt: profile.strikeAt ?? frameData.strikeAt,
    activeUntil: profile.activeUntil ?? frameData.activeUntil,
    recoverAt: profile.recoverAt ?? frameData.recoverAt
  };
}
