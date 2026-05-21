const slide = (number) => `./assets/work/slides/slide-${String(number).padStart(3, "0")}.webp`;
const thumb = (number) => `./assets/work/thumbs/slide-${String(number).padStart(3, "0")}.jpg`;

const projects = [
  {
    id: "ufo-aqui",
    number: "NEW",
    title: "UFO_AQUI",
    category: "Immersive editorial portal / 360 WebGL experience",
    role: "Direção criativa, UI premium, implementação front-end e viewer 360",
    tools: "HTML, CSS, JavaScript, Three.js, equirectangular assets e GenAI",
    year: "2026",
    hero: "./ufo-aqui/assets/hero-intelligence.png",
    liveUrl: "./ufo-aqui/",
    codeUrl: "https://github.com/VinisiusZen/labcomarts-portfolio/tree/main/ufo-aqui",
    slides: [],
    customGallery: [
      "./ufo-aqui/assets/hero-intelligence.png",
      "./ufo-aqui/assets/portal-360.png",
      "./ufo-aqui/assets/archive-dossier.png",
      "./ufo-aqui/assets/area51-panorama.png",
      "./ufo-aqui/assets/media-network.png"
    ],
    tags: [
      "Editorial portal",
      "UAP/UFO visual identity",
      "Three.js 360 viewer",
      "Interactive hotspots",
      "Brazilian disclosure media",
      "AI-assisted art direction",
      "Static GitHub Pages deploy"
    ],
    summary:
      "Portal brasileiro premium sobre UFOs/UAPs, arquivos desclassificados, radar de notícias e experiências 360° com estética de central de inteligência.",
    challenge:
      "Transformar um briefing amplo de mídia investigativa, lore, curadoria e experiências imersivas em uma subpágina publicável, visualmente forte e sem depender de CMS ou build nesta primeira versão.",
    solution:
      "A entrega organiza o UFO_AQUI como plataforma editorial estática: hero cinematográfico, módulos de arquivos/casos/radar, classificação factual, seção de comunidade e viewer 360 WebGL com fullscreen, auto-rotate e hotspots.",
    highlights: [
      "Subpágina pronta para GitHub Pages em /ufo-aqui/.",
      "Viewer equirectangular com Three.js, drag, zoom, fullscreen, auto-rotate e hotspots clicáveis.",
      "Design system dark com verde radar, dourado militar, scanlines, HUD e painéis translúcidos.",
      "Dados editoriais mockados para arquivos, casos, radar e classificação de credibilidade.",
      "Assets do projeto copiados e normalizados para publicação independente."
    ]
  },
  {
    id: "vida-de-gato-wip",
    number: "WIP",
    title: "Vida de gato",
    category: "Playable demo / game prototype",
    role: "Direção criativa, game feel, sprites e animatic",
    tools: "HTML5 Canvas, JavaScript, sprite sheets e GenAI",
    year: "Work in progress",
    hero: "./assets/cat-wip/vida-de-gato-adulto-corrida.webp",
    video: "./assets/cat-wip/vida-de-gato-wip-loop.mp4",
    liveUrl: "./vida-de-gato-demo/",
    liveUrlEn: "./vida-de-gato-demo/en.html",
    codeUrl: "https://github.com/VinisiusZen/labcomarts-portfolio/tree/main/vida-de-gato-demo",
    tags: [
      "AI-generated animation sprites",
      "AI-assisted playable demo",
      "Creative Technologist",
      "HTML5 Canvas game prototype",
      "AI soundtrack generation",
      "Generated level design",
      "Sprite pipeline",
      "Game feel prototyping",
      "GenAI production workflow",
      "AI Creative Direction"
    ],
    soundtracks: [
      {
        label: "Fase 3 - O Limiar (Take 1)",
        src: "./vida-de-gato-demo/assets/audio/soundtracks/Fase 3_ O Limiar (Take 1).mp3"
      },
      {
        label: "Fase 3 - O Limiar (Take 2)",
        src: "./vida-de-gato-demo/assets/audio/soundtracks/Fase 3_ O Limiar (Take 2).mp3"
      },
      {
        label: "Fase 4 - A Disparada (Take 1)",
        src: "./vida-de-gato-demo/assets/audio/soundtracks/Fase 4_ A Disparada (Take 1).mp3"
      },
      {
        label: "Fase 4 - A Disparada (Take 2)",
        src: "./vida-de-gato-demo/assets/audio/soundtracks/Fase 4_ A Disparada (Take 2).mp3"
      }
    ],
    levelGallery: Array.from(
      { length: 14 },
      (_, index) => `./assets/cat-wip/levels/stage_${String(index + 1).padStart(2, "0")}.webp`
    ),
    customGallery: [
      "./assets/cat-wip/vida-de-gato-filhote-abrigo.webp",
      "./assets/cat-wip/vida-de-gato-filhote-salto.webp",
      "./assets/cat-wip/vida-de-gato-adulto-corrida.webp",
      "./assets/cat-wip/vida-de-gato-adulto-ataque.webp",
      "./assets/cat-wip/vida-de-gato-idoso-respiro.webp",
      "./assets/cat-wip/vida-de-gato-idoso-queda.webp",
      "./assets/cat-wip/vida-de-gato-animatic-ui.webp"
    ],
    summary:
      "Work in progress de um demo jogável sobre a vida de um gato, com sprites, fases de vida, cenários urbanos e animatic.",
    challenge:
      "Transformar uma ideia emocional em um protótipo jogável com leitura imediata: o gato precisa parecer vivo, vulnerável e responsivo, sem depender de uma produção completa de game ainda.",
    solution:
      "O protótipo usa HTML5 Canvas, sprites por fase de vida, estados de animação, cenários em progressão, tela de animatic, frame checker, controles por teclado/toque e testes de vibração para investigar game feel.",
    highlights: [
      "Demo jogável em Canvas com fases filhote, adulto e idoso.",
      "Sprites com estados de idle, run, jump, attack, down, getting up e grooming.",
      "Animatic do Ato 1 para amarrar narrativa, ritmo e atmosfera.",
      "Frame checker interno para revisar bounds, alpha e continuidade dos sprites.",
      "Loop de gameplay capturado como material de WIP para portfolio."
    ]
  },
  {
    id: "meu-nome-nao-e-silva-wip",
    number: "WIP",
    title: "Meu Nome Não É Silva",
    category: "AI game production / beat 'em up WIP",
    role: "Direção criativa, game design, pipeline de sprites e protótipo jogável",
    tools: "HTML5 Canvas, JavaScript, GenAI, sprite sheets, state machine e maker backend",
    year: "Work in progress",
    hero: "./assets/mnes-wip/mnes-combat-gameplay.webp",
    video: "./assets/mnes-wip/mnes-wip-loop.mp4",
    liveUrl: "./meu-nome-nao-e-silva-demo/",
    codeUrl: "https://github.com/VinisiusZen/labcomarts-portfolio/tree/main/meu-nome-nao-e-silva-demo",
    tags: [
      "AI game production",
      "Playable vertical slice",
      "Beat 'em up prototype",
      "AI-assisted sprite pipeline",
      "Creative Technologist",
      "Game feel prototyping",
      "HTML5 Canvas game prototype",
      "Data-driven combat tuning",
      "State machine design",
      "Backend Maker",
      "State cycler QA",
      "Prompt library",
      "AI Art Direction",
      "Original IP development"
    ],
    soundtracks: [
      {
        label: "O Rio Sabe - menu theme",
        src: "./meu-nome-nao-e-silva-demo/assets/audio/o-rio-sabe-theme.mp3"
      },
      {
        label: "Press Start cue",
        src: "./meu-nome-nao-e-silva-demo/assets/audio/press-start-placeholder.mp3"
      }
    ],
    levelGallery: [
      "./assets/mnes-wip/mnes-level-riverbank.webp",
      "./assets/mnes-wip/mnes-level-quilombo.webp",
      "./assets/mnes-wip/mnes-level-colonial.webp"
    ],
    customGallery: [
      "./assets/mnes-wip/mnes-title-menu.webp",
      "./assets/mnes-wip/mnes-combat-gameplay.webp",
      "./assets/mnes-wip/mnes-combat-action.webp",
      "./assets/mnes-wip/mnes-backend-maker.webp",
      "./assets/mnes-wip/mnes-state-cycler.webp",
      "./assets/mnes-wip/mnes-combat-river.webp"
    ],
    summary:
      "Experiência de produção de game com AI em andamento: uma vertical slice 2.5D de beat 'em up que junta IP original, sprites, combate, áudio, maker/backend e QA visual.",
    challenge:
      "Transformar uma ideia autoral em algo testável, com fantasia clara, leitura de combate, cenas, inimigos e um pipeline capaz de receber assets gerados por AI sem quebrar a consistência do jogo.",
    solution:
      "O protótipo organiza a produção em sistemas: Canvas jogável, mapa de ações, frame data, spritesheets com alpha, editor de estados, maker/backend, galeria de cenários, intro cinemática e trilha inicial para validar a experiência enquanto os assets finais evoluem.",
    highlights: [
      "Demo jogável online com combate 2.5D, HUD, inimigos, dano, combos, especiais e restart.",
      "Pipeline de sprites por AI com atlas, limpeza de alpha, margem técnica e revisão de baseline.",
      "Backend Maker para revisar personagens, luta, inimigos, cenários e prompts técnicos.",
      "State Cycler para QA de animações, transições, slots de sprite/SFX e estados planejados.",
      "Trilha e cue inicial como estudo de áudio para menu, atmosfera e identidade do protótipo.",
      "Case posicionado como Creative Technologist, AI Art Direction e GenAI production workflow."
    ]
  },
  {
    id: "cinema-mask-action",
    number: "01",
    title: "Uma ação para cinema",
    category: "Experience / app / social activation",
    role: "Direção criativa, conceito e mecânica promocional",
    tools: "GenAI, Photoshop, apresentação e jornada",
    year: "Concept study",
    hero: slide(11),
    slides: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    summary:
      "Uma experiência para lançamento em cinema: o target entra no app, personaliza a máscara, imprime, monta, usa durante o filme e publica em redes sociais.",
    challenge:
      "Criar uma ação que saísse do cartaz tradicional e virasse comportamento dentro da sala, com presença física no cinema, mecânica digital e potencial de mídia espontânea.",
    solution:
      "A jornada foi desenhada em etapas claras: app de personalização, impressão da máscara, montagem antes da sessão, uso no cinema, postagem social e premiação das melhores criações dentro do app.",
    highlights: [
      "Jornada completa do app até a sala de cinema.",
      "Entrada do cinema decorada como ponto de foto e chamada para participação.",
      "Máscaras personalizadas como mídia física, social e de comunidade.",
      "Premiação e promoção das melhores criações no app.",
      "Visualização de targets usando a ação em uma sessão cheia."
    ]
  },
  {
    id: "cafe-solo",
    number: "02",
    title: "Café Solo",
    category: "Creative study / brand expansion",
    role: "Estudo criativo, direções visuais e ativações",
    tools: "GenAI, direção de arte, storytelling, apresentação",
    year: "Concept study",
    hero: slide(13),
    slides: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40],
    summary:
      "Estudo criativo para Café Solo: marca, produtos, eventos, ativações, ambientes e novos territórios de negócio.",
    challenge:
      "Expandir o imaginário da marca para além da bebida, criando caminhos para presença cultural, conteúdo, ponto físico, eventos e ações promocionais.",
    solution:
      "O projeto organiza várias frentes de exploração visual: kits, posters, ambientes, objetos, ativações de mesa, eventos, adesivos e territórios de lifestyle.",
    highlights: [
      "Sistema de ideias para eventos e ações de marca.",
      "Exploração de embalagens, objetos e pontos de contato.",
      "Peças de comunicação com tom provocativo e memorável.",
      "Visualizações de espaços, displays e experiências.",
      "Estudo de oportunidades para novas áreas de negócio."
    ]
  },
  {
    id: "eucerin-selos",
    number: "03",
    title: "Eucerin: selos de produto",
    category: "Product communication / seals",
    role: "Design de selos, materiais de produto e organização visual",
    tools: "Photoshop, Illustrator, layout, apresentação",
    year: "Healthcare / beauty",
    hero: slide(44),
    slides: [41, 43, 44, 45, 46],
    summary:
      "Design de selos e materiais para Eucerin, com foco em clareza de benefício, credibilidade de produto e leitura em ponto de contato.",
    challenge:
      "Comunicar atributos técnicos e diferenciais de produto sem perder sofisticação, hierarquia e confiança visual.",
    solution:
      "Foram estruturados layouts, selos, painéis e suportes de explicação visual para guiar a leitura do produto e dos benefícios principais.",
    highlights: [
      "Selos e claims organizados por hierarquia.",
      "Materiais visuais de produto para comunicação técnica.",
      "Aplicações em layouts de apresentação e ponto de contato.",
      "Sistema visual limpo para categoria dermocosmética."
    ]
  },
  {
    id: "packshot-3d-agencias",
    number: "04",
    title: "Packshot 3D",
    compactTitle: true,
    category: "3D packshot / agencies sales case",
    role: "Direção visual, modelagem, render, motion e comunicação comercial",
    tools: "Cinema 4D, After Effects, Photoshop, render em alta resolução",
    year: "Commercial 3D",
    hero: "./assets/packshot-3d/packshot-render.webp",
    video: "./assets/packshot-3d/vacina-render-rise.mp4",
    tags: [
      "3D Packshot",
      "Product visualization",
      "High-resolution render",
      "Motion design",
      "Agency sales material",
      "Commercial 3D",
      "Healthcare content",
      "Social media carousel",
      "Cinema 4D",
      "After Effects"
    ],
    carouselGallery: Array.from(
      { length: 9 },
      (_, index) => `./assets/packshot-3d/carousel-${String(index + 1).padStart(2, "0")}.webp`
    ),
    processVideos: [
      {
        label: "Making of - render em alta resolução",
        src: "./assets/packshot-3d/making-of-10k-render.mp4",
        poster: "./assets/packshot-3d/packshot-render.webp"
      }
    ],
    customGallery: [
      "./assets/packshot-3d/packshot-render.webp",
      "./assets/packshot-3d/xarope-frasco.webp",
      "./assets/packshot-3d/rotulo-xarope-mel.webp"
    ],
    summary:
      "Case criado para vender jobs de 3D para agências: carrossel comercial, render de produto, vídeo de packshot e making-of mostrando produção em altíssima resolução.",
    challenge:
      "Transformar uma oferta técnica de 3D em uma peça comercial simples de entender, capaz de mostrar qualidade visual, processo e aplicações reais para conquistar jobs com agências.",
    solution:
      "Foi criado um carrossel de venda para Instagram, com linguagem direta sobre packshots sob medida, acompanhado por renders de produto e um vídeo 3D de vacina que demonstra iluminação, profundidade, textura e acabamento de motion.",
    highlights: [
      "Carrossel comercial explicando a oferta de packshot 3D para marcas e agências.",
      "Vídeo de packshot sobre vacina usado como render principal do case.",
      "Making-of mostrando trabalho em alta resolução e controle de detalhe.",
      "Aplicações para pharma, healthcare, embalagem, social content e campanhas.",
      "Material criado para prospecção, que ajudou a fechar jobs de 3D."
    ]
  },
  {
    id: "vacinas-3d",
    number: "04",
    title: "Vídeo 3D sobre vacinas",
    category: "3D / medical content",
    role: "Direção visual, composição e narrativa para vídeo",
    tools: "3D, motion, edição, direção de arte",
    year: "Medical content",
    hero: slide(42),
    slides: [42],
    summary:
      "Peça de vídeo 3D sobre vacinas, apresentada no portfolio como referência de construção visual para conteúdo médico.",
    challenge:
      "Transformar um tema técnico em uma imagem de impacto, com leitura imediata e linguagem compatível com comunicação de saúde.",
    solution:
      "A direção visual usa o frasco como ponto de foco, contraste alto e estrutura de mensagem simples para sustentar uma narrativa audiovisual.",
    highlights: [
      "Visual 3D para tema médico.",
      "Composição de alto contraste.",
      "Mensagem direta e foco em retenção.",
      "Base para vídeo explicativo ou institucional."
    ]
  },
  {
    id: "triplixam-ajuda-visual",
    number: "05",
    title: "Triplixam: ajuda visual",
    category: "Visual aid / pharmaceutical",
    role: "Design de ajuda visual, infografia e narrativa de produto",
    tools: "Photoshop, Illustrator, layout, apresentação",
    year: "Pharma",
    hero: slide(49),
    slides: [47, 48, 49, 50, 51, 52, 53],
    summary:
      "Exemplos de ajuda visual para Triplixam, organizando dados, argumento de produto e metáfora visual em uma narrativa de visita.",
    challenge:
      "Dar clareza a mensagens técnicas, comparativos e dados de eficácia dentro de uma experiência de leitura rápida para o time de campo.",
    solution:
      "O material usa uma metáfora de controle e navegação para integrar benefício, dado, produto e argumento comercial.",
    highlights: [
      "Infografia aplicada a comunicação farmacêutica.",
      "Hierarquia clara para visita médica.",
      "Metáfora visual consistente entre as peças.",
      "Dados e produto integrados na mesma narrativa."
    ]
  },
  {
    id: "logo-studies",
    number: "06",
    title: "Estudos de logos",
    category: "Brand identity studies",
    role: "Exploração de marca, lettering e identidade visual",
    tools: "Illustrator, Photoshop, direção de arte",
    year: "Brand studies",
    hero: slide(54),
    slides: [54, 55],
    summary:
      "Estudos de logos e linguagem visual, incluindo assinaturas com energia promocional e comportamento de campanha.",
    challenge:
      "Criar marcas com personalidade rápida, leitura forte e capacidade de sustentar ações de incentivo ou comunicação interna.",
    solution:
      "Os estudos exploram tipografia, volume, energia, cor e ritmo visual para nomes com vocação de campanha.",
    highlights: [
      "Lettering e tratamento de marca.",
      "Exploração de volume e energia visual.",
      "Assinaturas para campanhas e programas.",
      "Leitura rápida em materiais de comunicação."
    ]
  },
  {
    id: "linha-produtos",
    number: "07",
    title: "Comunicação de linha",
    category: "Product line communication",
    role: "Design de comunicação, conceito e organização de portfolio",
    tools: "Photoshop, Illustrator, layout",
    year: "Healthcare",
    hero: slide(56),
    slides: [56],
    summary:
      "Design de comunicação para linha de produtos, conectando benefício emocional, arquitetura de marcas e leitura de portfolio.",
    challenge:
      "Apresentar diferentes produtos de uma mesma linha com unidade visual, sem apagar o papel de cada marca.",
    solution:
      "A peça usa uma metáfora de destino e bem-estar para organizar a linha e facilitar leitura comparativa.",
    highlights: [
      "Comunicação integrada de linha.",
      "Organização visual de múltiplos produtos.",
      "Uso de metáfora para benefício emocional.",
      "Design para apresentação e venda."
    ]
  },
  {
    id: "kios-ajuda-visual",
    number: "08",
    title: "KIOS: ajuda visual",
    category: "Visual aid / healthcare",
    role: "Design de peça, argumento visual e composição",
    tools: "Photoshop, Illustrator, layout",
    year: "Healthcare",
    hero: slide(58),
    slides: [58],
    summary:
      "Ajuda visual para KIOS com foco em impacto, metáfora anatômica e mensagem direta para apoio de visita.",
    challenge:
      "Criar uma peça com força visual suficiente para abrir conversa e sustentar o argumento de produto.",
    solution:
      "A composição centraliza o impacto no órgão, conecta embalagem e benefício e organiza a mensagem para leitura imediata.",
    highlights: [
      "Imagem de abertura com alto impacto.",
      "Produto conectado ao argumento principal.",
      "Layout direto para visita.",
      "Tratamento visual dramático e memorável."
    ]
  },
  {
    id: "torrent-gigante",
    number: "09",
    title: "Torrent Endo: gigante",
    category: "Motivational campaign / sales team",
    role: "Campanha motivacional, conceito, key visual e desdobramentos",
    tools: "Photoshop, direção de arte, apresentação",
    year: "Torrent",
    hero: slide(59),
    slides: [59, 60, 61, 62, 63, 64, 65],
    summary:
      "Campanha motivacional Endo para Torrent, usando a metáfora do gigante para mobilizar o time de vendas.",
    challenge:
      "Criar uma narrativa de incentivo que valorizasse potência, respeito competitivo e senso de conquista para o time.",
    solution:
      "O conceito 'Você é Gigante' se desdobra em key visual, peças de boas-vindas, comunicação de premiação e materiais de suporte.",
    highlights: [
      "Conceito central claro e motivacional.",
      "Sistema visual com desdobramentos impressos e digitais.",
      "Linguagem de incentivo para time de vendas.",
      "Peças de ambientação, reconhecimento e competição."
    ]
  },
  {
    id: "adaptar-evoluir",
    number: "10",
    title: "Adaptar para evoluir",
    category: "Motivational campaign / strategy",
    role: "Solução criativa, narrativa e campanha de vendas",
    tools: "Photoshop, direção de arte, apresentação",
    year: "Torrent",
    hero: slide(67),
    slides: [66, 67, 68, 69],
    summary:
      "Campanha Endo para Torrent criada como solução inteligente para o momento do time de vendas: adaptar para evoluir.",
    challenge:
      "Responder a um contexto de mudança com uma mensagem que não soasse defensiva, mas estratégica, ativa e mobilizadora.",
    solution:
      "A campanha usa a ideia de adaptação como vantagem competitiva, com metáfora visual de natureza, timing e movimento de ataque.",
    highlights: [
      "Conceito alinhado ao momento do time.",
      "Mensagem estratégica sem perder energia comercial.",
      "Metáfora visual simples e memorável.",
      "Desdobramentos para trade e comunicação interna."
    ]
  },
  {
    id: "fator-annita",
    number: "11",
    title: "Fator Annita",
    category: "Visual aids / pharmaceutical",
    role: "Ajuda visual, layout de dados e narrativa comercial",
    tools: "Photoshop, Illustrator, layout",
    year: "Pharma",
    hero: slide(70),
    slides: [70, 71, 72, 73],
    summary:
      "Mais exemplos de ajuda visual, com foco em produto, argumento comparativo, eficiencia e seguranca.",
    challenge:
      "Organizar dados, claim, tratamento e posicionamento de forma objetiva para apoio ao time de campo.",
    solution:
      "A linguagem usa um key visual de alto reconhecimento, paineis de dados e chamadas diretas para facilitar apresentacao.",
    highlights: [
      "Sistema de ajuda visual com dados e claims.",
      "Tratamento grafico de produto e categoria.",
      "Paineis comparativos para argumentacao.",
      "Visual de campanha aplicado a material tecnico."
    ]
  },
  {
    id: "theraskin-3d",
    number: "12",
    title: "Theraskin 3D",
    category: "3D brand treatment",
    role: "Tratamento visual de marca e composicao",
    tools: "3D, Photoshop, direção de arte",
    year: "Brand / healthcare",
    hero: "./assets/work/custom/theraskin-3d.webp",
    slides: [],
    customGallery: ["./assets/work/custom/theraskin-3d.webp"],
    summary:
      "Tratamento 3D da marca Theraskin preservado como peça isolada, retirando os outros materiais do slide original.",
    challenge:
      "Separar a peça relevante de um slide com muitos trabalhos misturados e dar a ela uma leitura limpa dentro do portfolio.",
    solution:
      "O slide foi recortado para manter apenas o tratamento da marca, funcionando como um registro direto de craft visual.",
    highlights: [
      "Peça mantida sem os materiais extras do slide.",
      "Tratamento de marca com volume e sombra.",
      "Aplicação simples para mostrar craft visual.",
      "Slide 75 foi removido do portfolio."
    ]
  }
];

function projectUrl(project) {
  return `./project.html?id=${encodeURIComponent(project.id)}`;
}

function updateClock() {
  const clock = document.querySelector("[data-clock]");
  if (!clock) return;
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(now);
}

function updateProgress() {
  const progress = document.querySelector(".progress");
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;
}

function setupReveal() {
  const targets = document.querySelectorAll(
    ".section-head, .work-card, .profile-band, .services-strip article, .ai-lab, .contact, .project-aside, .project-hero, .detail-grid, .process-module, .gallery figure, .next-project"
  );
  targets.forEach((item) => item.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((item) => observer.observe(item));
  window.setTimeout(() => {
    targets.forEach((item) => item.classList.add("is-visible"));
  }, 700);
}

function renderHome() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
        <a class="work-card" href="${projectUrl(project)}" style="--image: url('${project.hero}')">
          <div class="work-card-content">
            <span class="work-card-number">${project.number} / ${String(projects.length).padStart(2, "0")}</span>
            <h3>${project.title}</h3>
            <small>${project.category}</small>
            <p>${project.summary}</p>
            <span class="text-link">Abrir detalhe <span aria-hidden="true">→</span></span>
          </div>
        </a>
      `
    )
    .join("");
}

function getProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return projects.find((project) => project.id === id) || projects[0];
}

function renderDetail() {
  const mount = document.querySelector("[data-project-detail]");
  if (!mount) return;

  const project = getProject();
  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const gallery = project.customGallery || project.slides.map(slide);
  const rail = gallery.slice(0, 5);

  document.title = `${project.title} - Vinisius Zen`;
  mount.innerHTML = `
    <section class="project-layout">
      <aside class="project-aside">
        <a class="back-link" href="./index.html#work">← Back to work</a>
        <div class="project-count">${project.number} / ${String(projects.length).padStart(2, "0")}</div>
        <h1 class="${project.compactTitle ? "compact-title" : ""}">${project.title}</h1>
        <p class="project-category">${project.category}</p>
        <p class="project-summary">${project.summary}</p>
        <dl class="meta-list">
          <div><dt>Role</dt><dd>${project.role}</dd></div>
          <div><dt>Tools</dt><dd>${project.tools}</dd></div>
          <div><dt>Year</dt><dd>${project.year}</dd></div>
        </dl>
        ${
          project.liveUrl || project.codeUrl
            ? `<div class="project-actions">
                ${project.liveUrl ? `<a class="button" href="${project.liveUrl}">Testar online</a>` : ""}
                ${project.liveUrlEn ? `<a class="button secondary-button" href="${project.liveUrlEn}">English version</a>` : ""}
                ${project.codeUrl ? `<a class="button secondary-button" href="${project.codeUrl}">Codigo</a>` : ""}
              </div>`
            : ""
        }
        ${
          project.tags
            ? `<div class="tag-cloud" aria-label="Tags de posicionamento">
                ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
              </div>`
            : ""
        }
      </aside>

      <section class="project-main">
        <div class="project-hero">
          ${
            project.video
              ? `<video src="${project.video}" poster="${project.hero}" autoplay muted loop playsinline controls aria-label="${project.title}"></video>`
              : `<img src="${project.hero}" alt="${project.title}" />`
          }
        </div>
        <div class="thumb-rail" aria-label="Preview do projeto">
          ${rail.map((image) => `<img src="${image}" alt="" />`).join("")}
        </div>

        <div class="detail-grid">
          <div class="detail-copy">
            <article>
              <h2>The challenge</h2>
              <p>${project.challenge}</p>
            </article>
            <article>
              <h2>The solution</h2>
              <p>${project.solution}</p>
            </article>
          </div>
          <aside class="highlights">
            <h2>Project highlights</h2>
            <ul>${project.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
          </aside>
        </div>

        ${
          project.soundtracks
            ? `<section class="process-module">
                <div>
                  <p class="eyebrow">AI soundtrack generation</p>
                  <h2>Player com trilhas geradas para o demo.</h2>
                </div>
                <div class="audio-grid">
                  ${project.soundtracks
                    .map(
                      (track) => `
                        <article>
                          <strong>${track.label}</strong>
                          <audio controls preload="none" src="${track.src}"></audio>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }

        ${
          project.processVideos
            ? `<section class="process-module">
                <div>
                  <p class="eyebrow">Making of</p>
                  <h2>Processo, resolução e controle de render.</h2>
                </div>
                <div class="video-grid">
                  ${project.processVideos
                    .map(
                      (item) => `
                        <article>
                          <video src="${item.src}" poster="${item.poster || project.hero}" controls muted loop playsinline preload="metadata"></video>
                          <strong>${item.label}</strong>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }

        ${
          project.carouselGallery
            ? `<section class="process-module">
                <div>
                  <p class="eyebrow">Instagram carousel</p>
                  <h2>Carrossel comercial usado para vender o serviço.</h2>
                </div>
                <div class="carousel-strip" aria-label="Carrossel do projeto">
                  ${project.carouselGallery
                    .map(
                      (image, imageIndex) => `
                        <figure>
                          <img src="${image}" alt="${project.title} - carrossel ${imageIndex + 1}" />
                          <figcaption>${String(imageIndex + 1).padStart(2, "0")}</figcaption>
                        </figure>
                      `
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }

        <div class="gallery" aria-label="Galeria de slides do projeto">
          ${gallery
            .map(
              (image, imageIndex) => `
                <figure>
                  <img src="${image}" alt="${project.title} - imagem ${imageIndex + 1}" />
                  <figcaption>${project.number}.${String(imageIndex + 1).padStart(2, "0")}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>

        ${
          project.levelGallery
            ? `<section class="process-module">
                <div>
                  <p class="eyebrow">Generated level design</p>
                  <h2>Galeria de levels gerados para testar atmosfera, progressao e ritmo visual.</h2>
                </div>
                <div class="gallery level-gallery" aria-label="Galeria de levels gerados">
                  ${project.levelGallery
                    .map(
                      (image, imageIndex) => `
                        <figure>
                          <img src="${image}" alt="Vida de gato - level gerado ${imageIndex + 1}" />
                          <figcaption>Level ${String(imageIndex + 1).padStart(2, "0")}</figcaption>
                        </figure>
                      `
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }

        <a class="next-project" href="${projectUrl(next)}">
          <div>
            <span>Next project</span>
            <strong>${next.number} / ${next.title}</strong>
          </div>
          <span class="button">Open</span>
        </a>
      </section>
    </section>
  `;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

updateClock();
window.setInterval(updateClock, 30000);
renderHome();
renderDetail();
setupReveal();
updateProgress();
