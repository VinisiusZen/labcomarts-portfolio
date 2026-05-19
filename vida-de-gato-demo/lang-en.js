const enText = {
  loadingText: "Loading assets...",
  gameUiToggle: "UI",
  openCinematicButton: "ANIMATIC",
  frameCheckerButton: "FRAME CHECKER",
  hapticsToggle: "HAPTICS",
  fullscreenButton: "FULLSCREEN",
  hapticsClose: "CLOSE",
  hapticsStatus: "Connect a controller or use a mobile device with vibration.",
  closeCinematic: "PLAY",
  cinematicBodyButton: "BODY",
  cinematicVoiceButton: "VOICE",
  frameCheckerClose: "CLOSE",
  nextFrame: "Next frame",
  checkerInfo: "Waiting for assets..."
};

const beatTranslations = [
  {
    title: "The shelter",
    subtitle: "Before the world became too big.",
    copy:
      "The kitten is still close to its mother. The sound is muffled, warm, almost safe. Every small movement is a discovery: lifting its head, moving its ears, feeling the light."
  },
  {
    title: "First steps",
    subtitle: "The first rupture.",
    copy:
      "It begins to move away. Still clumsy, still looking back, still hoping the mother is there. Curiosity pushes it farther than fear can hold."
  },
  {
    title: "The threshold",
    subtitle: "The line between care and world.",
    copy:
      "At the shelter exit, the light hits hard. Wind, noise and street smell arrive all at once. One step outside becomes the first great crossing."
  },
  {
    title: "The scare",
    subtitle: "Curiosity becomes survival.",
    copy:
      "A sharp sound cuts through everything. The body shrinks before understanding. The heart races. Play is over. The button is no longer discovery. It is escape."
  },
  {
    title: "The street",
    subtitle: "The world is too big.",
    copy:
      "The run breaks. Lights pass too fast. A brake, a horn, an impact that may have been almost real or too real. The kitten falls and the world spins."
  },
  {
    title: "The rain",
    subtitle: "The street becomes a river.",
    copy:
      "Water arrives first as a puddle, then as force. Paws slip. The body tries to resist, but the current pulls. The kitten no longer chooses the direction."
  },
  {
    title: "The drain",
    subtitle: "Almost disappearing.",
    copy:
      "The current turns. The head goes in and out of the water. Air is missing. The drain appears like a dark mouth, pulling everything in."
  },
  {
    title: "The rescue",
    subtitle: "Still alive.",
    copy:
      "Something changes in the flow. A wheel, a light, an intervention. One last impulse, a different splash, and the water stops winning."
  }
];

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function translateStaticUi() {
  document.documentElement.lang = "en";
  document.title = "Vida de gato - Playable demo";
  document.querySelector(".loading-title")?.replaceChildren("Vida de gato");
  Object.entries(enText).forEach(([id, value]) => setText(id, value));

  document.querySelectorAll(".status-line").forEach((item) => {
    item.childNodes[0].textContent = item.textContent.includes("Estado")
      ? "State: "
      : item.textContent.includes("Fase")
        ? "Phase: "
        : item.textContent.includes("Controle")
          ? "Control: "
          : item.childNodes[0].textContent;
  });

  const stageButtons = document.querySelectorAll(".stage-button");
  ["Kitten", "Adult", "Elder"].forEach((label, index) => {
    if (stageButtons[index]) stageButtons[index].textContent = label;
  });

  document.querySelectorAll(".scene-picker").forEach((label) => {
    const select = label.querySelector("select");
    const isStage = select?.id === "stageSelect";
    label.childNodes[0].textContent = isStage ? "Level " : "Soundtrack ";
  });

  const instructions = document.querySelector(".instructions");
  if (instructions) {
    instructions.innerHTML =
      "A/D or arrows: move | Shift: run | Space: jump | J: attack | S: fall | W: get up | K: care | L: voice | 1/2/3: life phases<br />DualSense: analog/D-pad moves | X jumps | Square attacks | Circle falls | Triangle gets up | L1 care | R1 meow | R2 run | D-pad up/down phases | Share/Options levels";
  }

  const debugTitle = document.querySelector(".debug-panel h1");
  if (debugTitle) debugTitle.textContent = "Animation Debug";
  const beatBrand = document.querySelector(".beat-brand strong");
  if (beatBrand) beatBrand.textContent = "Cinematic sequence";
  const beatAct = document.querySelector(".beat-brand span");
  if (beatAct) beatAct.textContent = "Act 1";

  document.querySelectorAll(".beat-soundtrack-control").forEach((label) => {
    const select = label.querySelector("select");
    label.textContent = "Soundtrack ";
    if (select) label.appendChild(select);
  });
  document.querySelectorAll("option").forEach((option) => {
    if (option.value === "" || option.textContent.toLowerCase().includes("sem trilha")) {
      option.textContent = "No soundtrack";
    }
  });
  document.querySelector('[data-cine="restart"]')?.replaceChildren("Restart");
}

function translateBeatText() {
  const counter = document.getElementById("beatCounter")?.textContent || "1/8";
  const index = Math.max(0, Math.min(7, Number(counter.split("/")[0]) - 1 || 0));
  const beat = beatTranslations[index];
  setText("beatTitle", beat.title);
  setText("beatSubtitle", beat.subtitle);
  setText("beatCopy", beat.copy);
}

translateStaticUi();
window.setInterval(() => {
  translateStaticUi();
  translateBeatText();
}, 500);
