export const makerPromptDefaults = {
  spriteSheet: `Create a transparent PNG sprite sheet for a side-view 2.5D beat em up game.
Use exactly 8 columns. Each frame must be a 320x320 px cell.
Keep the character facing right. The engine mirrors left.
Keep the body inside a centered 181x181 px nominal safe zone.
Leave at least 64 px transparent padding on every side.
Keep foot/root anchor stable around x=160 and y=260-284.
Weapons, cloth, dreadlocks, mud, blood, smoke, and VFX can use the overflow area but must not touch the cell edge.
No checkerboard background, no grid lines, no labels, no UI, no baked floor shadow.
Use straight alpha. Maintain scale, lighting, camera angle, and silhouette consistency across frames.`,
  enemySheet: `Create a transparent PNG enemy sprite sheet for a 2.5D beat em up.
Use 8 columns and 6 rows. Each cell must be 320x320 px with alpha padding.
Rows: idle, chase, attack, special/rope/weapon, hit reactions, defeated.
The enemy faces right. Keep weapons and ropes fully inside each cell.
Preserve readable silhouettes and stable foot anchors.
No checkerboard, no labels, no frame borders.`,
  backgroundPlate: `Create a 16:9 horizontal game background plate for a 2.5D side-scrolling beat em up.
Target 3840x1080 for scrolling stages, with the left and right edges designed to tile or blend cleanly into adjacent plates.
Keep the playable ground readable in the lower middle third.
Leave foreground props modular where possible.
No characters, no UI, no text, no giant foreground object blocking combat readability.`,
  propAtlas: `Create a transparent PNG prop atlas for a 2.5D beat em up scene.
Each prop must be isolated with clean alpha and enough empty space for shadows.
No checkerboard, no labels, no grid.
Include wet mud, roots, rocks, ropes, lanterns, fences, broken wood, cloth strips, and low vegetation.
Keep objects grounded and readable at game scale.`
};

export const makerCombatStates = [
  {
    id: "idle",
    label: "Idle",
    command: "Sem input",
    systemic: true,
    comment: "Estado neutro. Precisa ser curto, legivel e pronto para cancelar em movimento ou ataque.",
    promptHint: "8 frames, subtle breathing, low center of gravity, machete down, no dramatic pose."
  },
  {
    id: "walk",
    label: "Walk / Move",
    command: "Dir",
    systemic: true,
    comment: "Movimento 2.5D no chao. O pe deve manter ancora consistente para evitar flutuar.",
    promptHint: "8 frames, grounded survival walk, forward-facing side view, stable foot anchor."
  },
  {
    id: "dashAttack",
    label: "Blitz / Dash Attack",
    command: "Forward Forward + A",
    systemic: true,
    comment: "Golpe de avanco. Deve mostrar antecipacao, compromisso e recovery punivel.",
    promptHint: "8 frames: run-in, preload, active hit, full machete reach, follow-through, recovery."
  },
  {
    id: "lightChain",
    label: "Attack Chain",
    command: "A, A, A, A",
    systemic: true,
    comment: "Base do combate. Cada golpe precisa ler como parte de uma frase fisica.",
    promptHint: "4 connected machete strikes, readable silhouette, no crop, strong impact frames."
  },
  {
    id: "launcher",
    label: "Launcher",
    command: "Down + Heavy",
    systemic: true,
    comment: "Levanta inimigos para juggle. O arco vertical precisa caber no overflow da celula.",
    promptHint: "8 frames, crouched preload, upward machete cut, active lift, recovery."
  },
  {
    id: "specialDefensive",
    label: "Defensive Special",
    command: "S neutro",
    systemic: true,
    comment: "Escape invencivel curto. Deve parecer protecao violenta, nao magia gratuita.",
    promptHint: "8 frames, planted stance, red sash/ritual burst around body, restrained horror tone."
  },
  {
    id: "specialOffensive",
    label: "Offensive Special",
    command: "Forward + S",
    systemic: true,
    comment: "Pressao forte com custo de coesao. Bom lugar para VFX de faixa oxidada.",
    promptHint: "8 frames, forward step, sash arc, machete extension, spiritual residue, recovery."
  },
  {
    id: "airNeutral",
    label: "Neutral Air",
    command: "J + A",
    systemic: true,
    comment: "Controle proximo no ar. Deve ser compacto e nao derrubar tudo automaticamente.",
    promptHint: "8 airborne frames, compact neutral slash, stable body mass, landing prep."
  },
  {
    id: "airForward",
    label: "Forward Air",
    command: "J + Forward + A",
    systemic: true,
    comment: "Entrada aerea. Usa movimento horizontal para aproximacao e pressao.",
    promptHint: "8 airborne frames, forward lean, active reach, follow-through, landing prep."
  },
  {
    id: "airDown",
    label: "Down Air",
    command: "J + Down + A",
    systemic: true,
    comment: "Golpe descendente para controle de espaco. Precisa de pose vertical legivel.",
    promptHint: "8 airborne frames, tucked knees, downward blade, impact prep, fall recovery."
  },
  {
    id: "grabFront",
    label: "Grab Front",
    command: "Encostar no inimigo",
    systemic: false,
    comment: "Reservado. Essencial para beat em up classico, ainda sem sprite dedicado.",
    promptHint: "8 frames, close-quarters clinch, front grab, no gore, grounded silhouettes."
  },
  {
    id: "starMove",
    label: "Star Move",
    command: "Star",
    systemic: false,
    comment: "Reservado. Super limitado; deve ser raro, pesado e narrativamente caro.",
    promptHint: "16 frames preferred, ceremonial violence, high impact, restrained spiritual horror."
  }
];

export const makerQualityProfiles = {
  draft: {
    label: "Draft",
    canvasScale: 0.5,
    smoothing: false,
    comment: "Mais leve para iterar rapido. Bom para testar estados e recortes."
  },
  gameplay: {
    label: "Gameplay",
    canvasScale: 1,
    smoothing: false,
    comment: "Padrao do prototipo. Mostra pixel/alpha de forma honesta."
  },
  presentation: {
    label: "Presentation",
    canvasScale: 1,
    smoothing: true,
    comment: "Suaviza preview para apresentacao, mas pode esconder problemas de alpha."
  }
};
