export const acts = [
  {
    id: "act1",
    title: "Act I - Flight and Freedom",
    subtitle: "Jungle, river, hunger, beasts, pursuit, first blood, first visions.",
    status: "playable",
    locationId: "marginOfSentence",
    card:
      "He is called Silva because the record needs a short word. The forest hears the lie. Tonight, the body runs before the spirit answers.",
    postCard:
      "First blood does not make him free. It proves the machine can bleed, and that proof has a cost.",
    scenes: [
      {
        id: "margin-sentence-wave",
        title: "Margin of Sentence",
        type: "combat",
        locationId: "marginOfSentence",
        objective: "Survive the pursuit, read the captain, and break the brute.",
        backgroundId: null,
        backgroundMode: "constructed",
        playerSpawn: { x: 300, lane: 0.58 },
        bounds: { left: 80, right: 2860, topLane: 0.2, bottomLane: 0.92 },
        props: [
          { atlasId: "naturalProps", propId: "rootLarge", x: 420, lane: 0.25, scale: 0.5, layer: "far", parallax: 0.42, alpha: 0.52 },
          { atlasId: "naturalProps", propId: "rootMid", x: 920, lane: 0.28, scale: 0.46, layer: "far", parallax: 0.48, alpha: 0.44, flip: true },
          { atlasId: "naturalProps", propId: "rootLarge", x: 1510, lane: 0.25, scale: 0.58, layer: "far", parallax: 0.44, alpha: 0.5 },
          { atlasId: "naturalProps", propId: "fogWide", x: 620, lane: 0.42, scale: 0.82, layer: "far", parallax: 0.58, alpha: 0.34 },
          { atlasId: "naturalProps", propId: "fogWide", x: 1410, lane: 0.4, scale: 0.9, layer: "far", parallax: 0.58, alpha: 0.3 },
          { atlasId: "naturalProps", propId: "rippleWide", x: 710, lane: 0.26, scale: 0.52, layer: "far", parallax: 0.6, alpha: 0.32 },
          { atlasId: "naturalProps", propId: "rippleWide", x: 1680, lane: 0.27, scale: 0.62, layer: "far", parallax: 0.6, alpha: 0.28 },
          { atlasId: "naturalProps", propId: "mudPuddle", x: 515, lane: 0.74, scale: 0.62, layer: "back" },
          { atlasId: "naturalProps", propId: "roundRock", x: 980, lane: 0.36, scale: 0.46, layer: "back" },
          { atlasId: "naturalProps", propId: "stoneCluster", x: 1260, lane: 0.62, scale: 0.58, layer: "back", alpha: 0.8 },
          { atlasId: "colonialProps", propId: "fenceBroken", x: 1435, lane: 0.42, scale: 0.48, layer: "back" },
          { atlasId: "colonialProps", propId: "lanternDark", x: 1528, lane: 0.64, scale: 0.36, layer: "back" },
          { atlasId: "colonialProps", propId: "stakesBound", x: 1660, lane: 0.48, scale: 0.52, layer: "back" },
          { atlasId: "naturalProps", propId: "rootMid", x: 1980, lane: 0.34, scale: 0.46, layer: "back", alpha: 0.72 },
          { atlasId: "naturalProps", propId: "mudPuddle", x: 2115, lane: 0.76, scale: 0.72, layer: "back", flip: true },
          { atlasId: "colonialProps", propId: "ropeLoose", x: 245, lane: 0.86, scale: 0.42, layer: "front" },
          { atlasId: "naturalProps", propId: "wetLog", x: 145, lane: 0.9, scale: 0.72, layer: "front" },
          { atlasId: "naturalProps", propId: "plantLow", x: 92, lane: 0.82, scale: 0.58, layer: "front" },
          { atlasId: "naturalProps", propId: "longBranch", x: 780, lane: 0.88, scale: 0.72, layer: "front", alpha: 0.88 },
          { atlasId: "naturalProps", propId: "logLong", x: 1675, lane: 0.9, scale: 0.68, layer: "front", flip: true },
          { atlasId: "naturalProps", propId: "plantWide", x: 1740, lane: 0.86, scale: 0.62, layer: "front" },
          { atlasId: "colonialProps", propId: "ironShard", x: 1910, lane: 0.88, scale: 0.62, layer: "front", alpha: 0.78 },
          { atlasId: "naturalProps", propId: "wetLog", x: 2350, lane: 0.91, scale: 0.66, layer: "front", flip: true },
          { atlasId: "naturalProps", propId: "plantTall", x: 2575, lane: 0.86, scale: 0.7, layer: "front" },
          { atlasId: "colonialProps", propId: "tornCloth", x: 2730, lane: 0.78, scale: 0.46, layer: "front" }
        ],
        waves: [
          {
            id: "first-pursuit",
            label: "First Pursuit",
            spawns: [
              { enemyClass: "hunter", x: 890, lane: 0.38, delay: 0.8 },
              { enemyClass: "captain", x: 1180, lane: 0.72, delay: 2.0 }
            ]
          },
          {
            id: "punishment-line",
            label: "Punishment Line",
            spawns: [
              { enemyClass: "hunter", x: 1640, lane: 0.36, delay: 0.6 },
              { enemyClass: "captain", x: 1840, lane: 0.7, delay: 1.1 },
              { enemyClass: "brute", x: 2200, lane: 0.56, delay: 2.1, elite: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "act2",
    title: "Act II - Family and Quilombo",
    subtitle: "Belonging, care, training, ritual, protection.",
    status: "stub",
    locationId: "quilomboHub",
    card:
      "Future vertical slice: the hub is not a menu. It is food, argument, prayer, repair, and watchfulness."
  },
  {
    id: "act3",
    title: "Act III - Loss and Return",
    subtitle: "Destruction, revenge, port, narrative war, the machine of commerce.",
    status: "stub",
    locationId: "portRecords",
    card:
      "Future vertical slice: the port turns bodies into entries, routes, ownership, and official truth."
  }
];
