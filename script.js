const slide = (number) => `./assets/work/slides/slide-${String(number).padStart(3, "0")}.webp`;
const thumb = (number) => `./assets/work/thumbs/slide-${String(number).padStart(3, "0")}.jpg`;

const projects = [
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
    ".section-head, .work-card, .profile-band, .services-strip article, .ai-lab, .contact, .project-aside, .project-hero, .detail-grid, .gallery figure, .next-project"
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
        <h1>${project.title}</h1>
        <p class="project-category">${project.category}</p>
        <p class="project-summary">${project.summary}</p>
        <dl class="meta-list">
          <div><dt>Role</dt><dd>${project.role}</dd></div>
          <div><dt>Tools</dt><dd>${project.tools}</dd></div>
          <div><dt>Year</dt><dd>${project.year}</dd></div>
        </dl>
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
