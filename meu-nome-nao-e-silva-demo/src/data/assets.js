export const assetManifest = {
  backgrounds: {
    marginOfSentence: {
      id: "marginOfSentence",
      label: "Margin of Sentence",
      type: "image",
      src: "./assets/backgrounds/act1-margin-riverbank-v01.png",
      fallback: "procedural-riverbank",
      plate: true
    },
    quilomboYard: {
      id: "quilomboYard",
      label: "Quilombo Yard",
      type: "image",
      src: "./assets/backgrounds/act2-quilombo-yard-v01.png",
      plate: true
    },
    colonialFront: {
      id: "colonialFront",
      label: "Colonial Front",
      type: "image",
      src: "./assets/backgrounds/act3-colonial-front-v01.png",
      plate: true
    }
  },
  characters: {
    silva: {
      id: "silva",
      label: "Silva v01 spritesheet",
      type: "image",
      src: "./assets/sprites/silva-v01-clean.png",
      systemic: false,
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 6,
        animations: {
          idle: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: true },
          walk: { row: 1, frames: [0, 1, 2, 3], fps: 9, loop: true },
          run: { row: 1, frames: [4, 5, 6, 7], fps: 11, loop: true },
          light: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 18, loop: false },
          heavy: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 13, loop: false },
          grab: { row: 4, frames: [0, 1, 2, 3], fps: 12, loop: false },
          dodge: { row: 4, frames: [1, 2, 3], fps: 16, loop: false },
          jump: { row: 4, frames: [4, 5, 6], fps: 10, loop: false },
          air: { row: 4, frames: [4, 5, 6], fps: 13, loop: false },
          hit: { row: 5, frames: [0, 1, 2], fps: 11, loop: false },
          defeated: { row: 5, frames: [3, 4], fps: 6, loop: false },
          pulse: { row: 5, frames: [5, 6, 7], fps: 9, loop: false },
          special: { row: 5, frames: [5, 6, 7], fps: 11, loop: false }
        }
      }
    },
    silvaBasicAttack: {
      id: "silvaBasicAttack",
      label: "Silva basic attack v01 padded",
      type: "image",
      src: "./assets/sprites/silva-basic-attack-v01-padded.png",
      systemic: false,
      qaExpected: ["light"],
      sheet: {
        columns: 8,
        rows: 1,
        frameWidth: 512,
        frameHeight: 512,
        nominalFrameWidth: 360,
        nominalFrameHeight: 360,
        sourceInset: 0,
        animations: {
          light: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 30, loop: false }
        }
      }
    },
    silvaActions: {
      id: "silvaActions",
      label: "Silva v03 padded action spritesheet",
      type: "image",
      src: "./assets/sprites/silva-actions-v03-padded.png",
      systemic: false,
      sheet: {
        columns: 8,
        rows: 10,
        frameWidth: 320,
        frameHeight: 320,
        nominalFrameWidth: 181,
        nominalFrameHeight: 181,
        sourceInset: 0,
        animations: {
          dashMove: { row: 0, frames: [1, 2, 3, 4, 5, 6, 7], fps: 15, loop: true },
          dashAttack: { row: 1, frames: [0, 1, 2, 4, 5, 6, 7], fps: 18, loop: false },
          launcher: { row: 2, frames: [0, 1, 2, 4, 5, 6, 7], fps: 14, loop: false },
          specialOffensive: { row: 3, frames: [0, 1, 2, 4, 5, 6, 7], fps: 13, loop: false },
          specialDefensive: { row: 4, frames: [0, 1, 2, 4, 5, 6, 7], fps: 13, loop: false },
          jump: { row: 5, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          airNeutral: { row: 6, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 13, loop: false },
          airForward: { row: 7, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 13, loop: false },
          airDown: { row: 8, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 13, loop: false },
          landing: { row: 9, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          redSash: { row: 4, frames: [0, 1, 2, 4, 5, 6, 7], fps: 13, loop: false }
        }
      }
    },
    silvaGrapple: {
      id: "silvaGrapple",
      label: "Silva v04 grapple and ground states",
      type: "image",
      src: "./assets/sprites/silva-grapple-v04-clean.png",
      systemic: false,
      qaExpected: ["grabReach", "grabHold", "grabThrow", "groundRecover", "ritualItem"],
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 0,
        animations: {
          grabReach: { row: 0, frames: [0, 1, 2, 3, 4, 5], fps: 10, loop: false },
          grabHold: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 8, loop: true },
          grabThrow: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 12, loop: false },
          groundRecover: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 9, loop: false },
          ritualItem: { row: 5, frames: [4, 5, 6, 7], fps: 7, loop: false }
        }
      }
    },
    silvaPresence: {
      id: "silvaPresence",
      label: "Silva v04 presence, taunt, and spirit states",
      type: "image",
      src: "./assets/sprites/silva-presence-v04-clean.png",
      systemic: false,
      qaExpected: ["idleAlt", "intimidate", "sashCall", "sentencePoint", "spiritRise", "kneelRecover", "idleReturn"],
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 0,
        animations: {
          idleAlt: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: true },
          intimidate: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 8, loop: false },
          sashCall: { row: 2, frames: [0, 1, 2, 3, 4, 5], fps: 9, loop: false },
          sentencePoint: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 9, loop: false },
          spiritRise: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 8, loop: true },
          kneelRecover: { row: 5, frames: [0, 1, 2, 3], fps: 7, loop: false },
          idleReturn: { row: 5, frames: [4, 5, 6, 7], fps: 7, loop: false }
        }
      }
    },
    silvaDamageRecovery: {
      id: "silvaDamageRecovery",
      label: "Silva v04 damage, knockdown, and wake-up states",
      type: "image",
      src: "./assets/sprites/silva-damage-recovery-v04-clean.png",
      systemic: false,
      qaExpected: ["hit", "stagger", "launched", "knockdown", "wakeup", "guardSpecial"],
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 0,
        animations: {
          hit: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          stagger: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          launched: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 9, loop: false },
          knockdown: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: false },
          wakeup: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 8, loop: false },
          guardSpecial: { row: 5, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 9, loop: true }
        }
      }
    },
    silvaSentence: {
      id: "silvaSentence",
      label: "Silva v04 sentence, containment, and food states",
      type: "image",
      src: "./assets/sprites/silva-sentence-v04-clean.png",
      systemic: false,
      qaExpected: ["idleAlt", "mercyGrab", "sentenceFinish", "carryGrab", "afterSentence", "foodRecover", "idleReturn"],
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 0,
        animations: {
          idleAlt: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: true },
          mercyGrab: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          sentenceFinish: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: false },
          carryGrab: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 9, loop: false },
          afterSentence: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: false },
          foodRecover: { row: 5, frames: [0, 1, 2, 3, 4, 5], fps: 8, loop: false },
          idleReturn: { row: 5, frames: [6, 7], fps: 7, loop: false }
        }
      }
    }
  },
  enemies: {
    hunter: {
      id: "hunter",
      label: "Hunter v01 spritesheet",
      type: "image",
      src: "./assets/sprites/hunter-v01-clean.png",
      systemic: false,
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 6,
        animations: {
          enter: { row: 0, frames: [0, 1, 2, 3], fps: 7, loop: true },
          idle: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: true },
          chase: { row: 1, frames: [4, 5, 6, 7], fps: 11, loop: true },
          attack: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 14, loop: false },
          rope: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 12, loop: false },
          hit: { row: 4, frames: [0, 1, 2, 3], fps: 10, loop: false },
          launched: { row: 4, frames: [3, 4, 5, 6], fps: 9, loop: false },
          stunned: { row: 4, frames: [2, 5, 6, 7], fps: 8, loop: false },
          defeated: { row: 5, frames: [0, 1, 2, 3], fps: 6, loop: false }
        }
      }
    },
    captain: {
      id: "captain",
      label: "Captain v01 spritesheet",
      type: "image",
      src: "./assets/sprites/captain-v01-clean.png",
      systemic: false,
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 6,
        animations: {
          enter: { row: 0, frames: [0, 1, 2, 3], fps: 7, loop: true },
          idle: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 7, loop: true },
          chase: { row: 1, frames: [3, 4, 5, 6, 7], fps: 11, loop: true },
          attack: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 14, loop: false },
          rope: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 12, loop: false },
          hit: { row: 4, frames: [0, 1, 2, 3], fps: 10, loop: false },
          launched: { row: 4, frames: [3, 4, 5, 6], fps: 9, loop: false },
          stunned: { row: 4, frames: [3, 4, 5, 6], fps: 8, loop: false },
          defeated: { row: 5, frames: [0, 1, 2, 3], fps: 6, loop: false }
        }
      }
    },
    brute: {
      id: "brute",
      label: "Overseer brute v01 spritesheet",
      type: "image",
      src: "./assets/sprites/brute-v01-clean.png",
      systemic: false,
      sheet: {
        columns: 8,
        rows: 6,
        frameWidth: 181,
        frameHeight: 181,
        sourceInset: 7,
        animations: {
          enter: { row: 0, frames: [0, 1, 2, 3], fps: 6, loop: true },
          idle: { row: 0, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 6, loop: true },
          chase: { row: 1, frames: [2, 3, 4, 5, 6], fps: 9, loop: true },
          attack: { row: 2, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 12, loop: false },
          rope: { row: 3, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 11, loop: false },
          hit: { row: 4, frames: [0, 1, 2, 3], fps: 9, loop: false },
          launched: { row: 4, frames: [3, 4, 5, 6], fps: 8, loop: false },
          stunned: { row: 4, frames: [2, 3, 4, 5, 6], fps: 8, loop: false },
          defeated: { row: 5, frames: [0, 1, 2, 3], fps: 6, loop: false }
        }
      }
    },
    enforcer: {
      id: "enforcer",
      label: "Overseer / enforcer class placeholder",
      type: "image",
      src: "./assets/enemies/enforcer-placeholder.svg",
      systemic: false
    }
  },
  props: {
    naturalProps: {
      id: "naturalProps",
      label: "Natural riverbank prop atlas v01",
      type: "image",
      src: "./assets/props/natural-props-v01-clean.png",
      atlas: {
        rootLarge: { x: 760, y: 10, w: 460, h: 205 },
        rootMid: { x: 455, y: 45, w: 300, h: 170 },
        mudPuddle: { x: 875, y: 260, w: 335, h: 118 },
        longBranch: { x: 350, y: 410, w: 330, h: 95 },
        logLong: { x: 880, y: 415, w: 325, h: 105 },
        wetLog: { x: 16, y: 575, w: 310, h: 112 },
        roundRock: { x: 675, y: 565, w: 170, h: 120 },
        stoneCluster: { x: 40, y: 720, w: 280, h: 90 },
        plantLow: { x: 30, y: 845, w: 155, h: 125 },
        plantTall: { x: 195, y: 845, w: 160, h: 130 },
        plantWide: { x: 1025, y: 835, w: 205, h: 135 },
        fogWide: { x: 445, y: 1000, w: 350, h: 85 },
        rippleWide: { x: 815, y: 1130, w: 390, h: 90 }
      }
    },
    colonialProps: {
      id: "colonialProps",
      label: "Colonial prop atlas v01",
      type: "image",
      src: "./assets/props/colonial-props-v01-clean.png",
      atlas: {
        ropeCoil: { x: 20, y: 18, w: 155, h: 85 },
        ropeLoose: { x: 205, y: 20, w: 165, h: 95 },
        lanternLit: { x: 405, y: 125, w: 130, h: 155 },
        lanternDark: { x: 35, y: 125, w: 115, h: 155 },
        stakesBound: { x: 790, y: 310, w: 145, h: 135 },
        fenceBroken: { x: 515, y: 610, w: 205, h: 95 },
        fenceLow: { x: 50, y: 610, w: 165, h: 95 },
        sackLarge: { x: 65, y: 420, w: 170, h: 130 },
        ritualPost: { x: 750, y: 735, w: 70, h: 135 },
        tornCloth: { x: 215, y: 880, w: 110, h: 105 },
        bundleWood: { x: 820, y: 1025, w: 175, h: 95 },
        ironShard: { x: 935, y: 1160, w: 110, h: 70 }
      }
    }
  },
  ui: {
    nameMark: {
      id: "nameMark",
      label: "Machete and double sash title mark",
      type: "image",
      src: "./assets/ui/name-mark.svg"
    }
  }
};
