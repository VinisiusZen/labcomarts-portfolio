const asset = (file) => `./assets/${file}`;

const scenes = [
  {
    id: "area51",
    title: "Área 51 — perímetro externo",
    subtitle: "Instalação restrita",
    imagePanorama: asset("area51-panorama.png"),
    thumbnail: asset("area51-panorama.png"),
    description: "Perímetro externo, mesa de campo, sinalização militar e atividade anômala no hangar.",
    hotspots: [
      {
        id: "hangar",
        label: "Hangar S-4",
        yaw: 18,
        pitch: -5,
        content: "Entrada associada ao lore de tecnologia reversa e materiais sob contenção.",
      },
      {
        id: "mesa",
        label: "Dossiê aberto",
        yaw: 0,
        pitch: -38,
        content: "Documentos em triagem editorial: fonte, data, status factual e hipótese de trabalho.",
      },
      {
        id: "cinegrafista",
        label: "Operador",
        yaw: -42,
        pitch: -18,
        content: "O cinegrafista não humano funciona como assinatura visual do universo UFO_AQUI.",
      },
    ],
  },
  {
    id: "nasa",
    title: "NASA Surveillance Leak",
    subtitle: "Órbita baixa",
    imagePanorama: asset("nasa-panorama.png"),
    thumbnail: asset("nasa-panorama.png"),
    description: "Monitoramento orbital, satélites, telemetria e possíveis sinais fora de padrão.",
    hotspots: [
      {
        id: "satellite",
        label: "Telemetria",
        yaw: 68,
        pitch: 5,
        content: "Painel de dados simulados para conectar narrativa, ciência e visual de investigação.",
      },
    ],
  },
  {
    id: "uso",
    title: "Base USO — profundezas",
    subtitle: "Anomalia subaquática",
    imagePanorama: asset("uso-panorama.png"),
    thumbnail: asset("uso-panorama.png"),
    description: "Uma leitura especulativa de estruturas submersas, USOs e atividade em zonas oceânicas.",
    hotspots: [
      {
        id: "submerso",
        label: "Objeto USO",
        yaw: 112,
        pitch: -6,
        content: "Sinal subaquático classificado como fringe até existir fonte verificável.",
      },
    ],
  },
  {
    id: "amazon",
    title: "Expedição Amazônia Anômala",
    subtitle: "Casos brasileiros",
    imagePanorama: asset("amazon-panorama.png"),
    thumbnail: asset("amazon-panorama.png"),
    description: "Ambiente de campo para relatos, avistamentos, Operação Prato e luzes anômalas.",
    hotspots: [
      {
        id: "mapa",
        label: "Mapa de relatos",
        yaw: -96,
        pitch: -14,
        content: "Camada narrativa para conectar testemunhos, horários, clima e posição geográfica.",
      },
    ],
  },
  {
    id: "s4",
    title: "Hangar S-4 — tecnologia reversa",
    subtitle: "Área restrita",
    imagePanorama: asset("s4-panorama.png"),
    thumbnail: asset("s4-panorama.png"),
    description: "Cena de laboratório/hangar para missões, arquivos e análises visuais de tecnologia não humana.",
    hotspots: [
      {
        id: "painel",
        label: "Painel técnico",
        yaw: 35,
        pitch: -8,
        content: "Hotspot preparado para abrir dossiês técnicos e notas de lore editorial.",
      },
    ],
  },
];

const archives = [
  ["46 vídeos UAP não entregues no prazo", "Congresso EUA", "Em análise", "Linha de cobrança pública sobre vídeos ainda não disponibilizados."],
  ["Release 01 dos arquivos UFO", "UAP", "Confirmado", "Primeira leva editorial para organizar fontes, status e perguntas abertas."],
  ["AARO e Casa Branca coordenam liberação", "AARO", "Em análise", "Mapa institucional dos atores envolvidos na próxima etapa de transparência."],
  ["Tim Burchett e registros anômalos", "Congresso EUA", "Alegação", "Declarações públicas tratadas como alegação até validação documental."],
  ["Apollo e arquivos UFO", "NASA", "Histórico", "Recorte histórico sobre imagens espaciais, ruído cultural e leitura crítica."],
  ["Área 51 e terremotos", "Tecnologia reversa", "Fringe", "Narrativa especulativa com selo claro para separar lore de evidência."],
  ["Operação Prato", "Brasil", "Histórico", "Caso brasileiro essencial para a memória ufóloga e análise documental."],
  ["Caso Varginha", "Brasil", "Em análise", "Relatos, cronologia e disputas públicas sobre o episódio de 1996."],
];

const cases = [
  ["1977", "Operação Prato", "Colares, PA", "Registros, relatos civis e presença militar em uma das investigações mais importantes do Brasil.", 5, ["Brasil", "Histórico"]],
  ["1996", "Caso Varginha", "Varginha, MG", "O caso brasileiro de maior impacto cultural, ainda cercado por testemunhos e controvérsias.", 4, ["Brasil", "Alegação"]],
  ["2004", "Nimitz Tic Tac", "Costa da Califórnia", "Encontro militar com sensores, pilotos e debate público sobre UAPs.", 5, ["UAP", "Militar"]],
  ["1947", "Roswell", "Novo México", "O mito fundador moderno entre cultura pop, documentos, versões oficiais e contra-narrativas.", 3, ["Histórico", "Fringe"]],
  ["1994", "Ariel School", "Ruwa, Zimbábue", "Relatos infantis coletivos que ainda mobilizam pesquisadores e documentaristas.", 3, ["Contato", "Escola"]],
  ["1997", "Phoenix Lights", "Arizona", "Avistamento massivo com registros públicos, vídeos e explicações concorrentes.", 4, ["UFO", "Civis"]],
];

const radarItems = [
  ["Quente", "UAP", "Nova cobrança legislativa pressiona liberação de vídeos e cadeia de custódia."],
  ["Monitorar", "AARO", "Atualizações institucionais indicam reorganização do fluxo de registros."],
  ["Virou post", "Brasil", "Casos nacionais voltam ao calendário editorial com foco em Operação Prato."],
  ["Monitorar", "USO", "Relatos oceânicos entram no painel como tendência fringe-cultural."],
];

const tags = ["UAP", "AARO", "NASA", "Congresso", "Brasil", "USO", "Pré-dilúvio"];

let currentCategory = "Todos";
let currentScene = scenes[0];
let viewer;

const qs = (selector) => document.querySelector(selector);

function renderArchiveFilters() {
  const categories = ["Todos", ...new Set(archives.map((item) => item[1]))];
  qs("#archiveFilters").innerHTML = categories
    .map((category) => `<button class="${category === currentCategory ? "is-active" : ""}" type="button" data-category="${category}">${category}</button>`)
    .join("");
}

function renderArchives() {
  const filtered = currentCategory === "Todos" ? archives : archives.filter((item) => item[1] === currentCategory);
  qs("#archiveGrid").innerHTML = filtered
    .map(
      ([title, category, status, description]) => `
        <article class="archive-card">
          <span class="tag">${status}</span>
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="archive-meta">
            <span>${category}</span>
            <span>UFO_AQUI</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCases() {
  qs("#caseTimeline").innerHTML = cases
    .map(
      ([year, title, location, summary, evidence, itemTags]) => `
        <article class="case-item">
          <span>${year} · ${location}</span>
          <h3>${title}</h3>
          <p>${summary}</p>
          <div class="evidence">Nível de evidência ${"◆".repeat(evidence)}${"◇".repeat(5 - evidence)}</div>
          <div class="case-tags">${itemTags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </article>
      `,
    )
    .join("");
}

function renderRadar() {
  qs("#radarTimestamp").textContent = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  qs("#radarTags").innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
  qs("#radarFeed").innerHTML = radarItems
    .map(
      ([status, category, title]) => `
        <article>
          <span>${status} · ${category}</span>
          <h3>${title}</h3>
          <p>Score editorial em revisão para carrossel, vídeo curto ou dossiê.</p>
        </article>
      `,
    )
    .join("");
}

function renderScenes() {
  qs("#sceneStrip").innerHTML = scenes
    .map(
      (scene) => `
        <button class="scene-card" type="button" data-scene="${scene.id}">
          <img src="${scene.thumbnail}" alt="${scene.title}" loading="lazy" />
          <div>
            <span class="tag">360°</span>
            <h3>${scene.title}</h3>
            <p>${scene.description}</p>
          </div>
        </button>
      `,
    )
    .join("");
}

function setupInteractions() {
  qs(".menu-toggle").addEventListener("click", () => {
    const header = qs(".site-header");
    const expanded = header.classList.toggle("is-open");
    qs(".menu-toggle").setAttribute("aria-expanded", String(expanded));
  });

  qs("#archiveFilters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    currentCategory = button.dataset.category;
    renderArchiveFilters();
    renderArchives();
  });

  qs("#sceneStrip").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-scene]");
    if (!button) return;
    const scene = scenes.find((item) => item.id === button.dataset.scene);
    if (scene) loadScene(scene);
  });

  qs("#fullscreenViewer").addEventListener("click", () => {
    const shell = qs("#viewerShell");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      shell.requestFullscreen();
    }
  });

  qs("#autoRotateToggle").addEventListener("click", (event) => {
    if (!viewer) return;
    viewer.autoRotate = !viewer.autoRotate;
    event.currentTarget.setAttribute("aria-pressed", String(viewer.autoRotate));
  });

  qs("#modalClose").addEventListener("click", closeModal);
  qs("#hotspotModal").addEventListener("click", (event) => {
    if (event.target.id === "hotspotModal") closeModal();
  });
}

function openModal(hotspot) {
  qs("#modalTitle").textContent = hotspot.label;
  qs("#modalContent").textContent = hotspot.content;
  qs("#hotspotModal").hidden = false;
}

function closeModal() {
  qs("#hotspotModal").hidden = true;
}

async function initViewer() {
  const THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");
  const container = qs("#viewerCanvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const geometry = new THREE.SphereGeometry(500, 72, 48);
  const textureLoader = new THREE.TextureLoader();
  geometry.scale(-1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x0b1a12 });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const state = {
    autoRotate: true,
    isPointerDown: false,
    lon: 0,
    lat: 0,
    startX: 0,
    startY: 0,
    startLon: 0,
    startLat: 0,
    camera,
    renderer,
    scene,
    material,
    textureLoader,
    hotspots: [],
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const updatePointer = (event) => {
    state.lon = (state.startX - event.clientX) * 0.12 + state.startLon;
    state.lat = (event.clientY - state.startY) * 0.12 + state.startLat;
  };

  container.addEventListener("pointerdown", (event) => {
    state.isPointerDown = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startLon = state.lon;
    state.startLat = state.lat;
    container.setPointerCapture(event.pointerId);
  });
  container.addEventListener("pointermove", (event) => {
    if (state.isPointerDown) updatePointer(event);
  });
  container.addEventListener("pointerup", () => {
    state.isPointerDown = false;
  });
  container.addEventListener("wheel", (event) => {
    camera.fov = Math.max(42, Math.min(92, camera.fov + event.deltaY * 0.02));
    camera.updateProjectionMatrix();
  });

  window.addEventListener("resize", resize);
  resize();

  const animate = () => {
    requestAnimationFrame(animate);
    if (state.autoRotate && !state.isPointerDown) state.lon += 0.025;
    state.lat = Math.max(-70, Math.min(70, state.lat));
    const phi = THREE.MathUtils.degToRad(90 - state.lat);
    const theta = THREE.MathUtils.degToRad(state.lon);
    camera.target = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta),
    );
    camera.lookAt(camera.target);
    renderer.render(scene, camera);
    updateHotspots(THREE, state);
  };

  viewer = state;
  loadScene(currentScene);
  animate();
}

function loadScene(scene) {
  currentScene = scene;
  qs("#viewerTitle").textContent = scene.title;
  renderHotspots(scene.hotspots);
  if (!viewer) return;
  viewer.textureLoader.load(scene.imagePanorama, (texture) => {
    viewer.material.map = texture;
    viewer.material.color.setHex(0xffffff);
    viewer.material.needsUpdate = true;
  });
}

function renderHotspots(hotspots) {
  qs("#hotspotLayer").innerHTML = hotspots
    .map((hotspot) => `<button class="hotspot" type="button" data-hotspot="${hotspot.id}">${hotspot.label}</button>`)
    .join("");
  qs("#hotspotLayer").querySelectorAll(".hotspot").forEach((button) => {
    button.addEventListener("click", () => {
      const hotspot = currentScene.hotspots.find((item) => item.id === button.dataset.hotspot);
      if (hotspot) openModal(hotspot);
    });
  });
}

function updateHotspots(THREE, state) {
  const layer = qs("#hotspotLayer");
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  currentScene.hotspots.forEach((hotspot) => {
    const button = layer.querySelector(`[data-hotspot="${hotspot.id}"]`);
    if (!button) return;
    const phi = THREE.MathUtils.degToRad(90 - hotspot.pitch);
    const theta = THREE.MathUtils.degToRad(hotspot.yaw);
    const vector = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta),
    );
    vector.project(state.camera);
    const x = (vector.x * 0.5 + 0.5) * width;
    const y = (-vector.y * 0.5 + 0.5) * height;
    const visible = vector.z < 1 && x >= 0 && x <= width && y >= 0 && y <= height;
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.opacity = visible ? "1" : "0";
    button.style.pointerEvents = visible ? "auto" : "none";
  });
}

function boot() {
  renderArchiveFilters();
  renderArchives();
  renderCases();
  renderRadar();
  renderScenes();
  setupInteractions();
  initViewer().catch((error) => {
    qs("#viewerCanvas").innerHTML = `<div class="viewer-fallback">Viewer 360 indisponível: ${error.message}</div>`;
  });
}

boot();
