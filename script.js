const progress = document.querySelector(".progress");
const revealTargets = document.querySelectorAll(
  ".section-heading, .case, .fit-card, .pipeline li, .evidence-list p, .contact-panel"
);
const iceStage = document.querySelector(".icecream-stage");
const cinematic = document.querySelector(".cinematic-media");

revealTargets.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((item) => revealObserver.observe(item));

window.setTimeout(() => {
  revealTargets.forEach((item) => item.classList.add("is-visible"));
}, 900);

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;
}

function applyPointerDepth(event, target, selector, strength = 14) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  target.querySelectorAll(selector).forEach((item, index) => {
    const depth = (index + 1) / 5;
    item.style.translate = `${x * strength * depth}px ${y * strength * depth}px`;
  });
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if (iceStage) {
  iceStage.addEventListener("pointermove", (event) => {
    applyPointerDepth(event, iceStage, ".ice, .callout", 18);
  });
  iceStage.addEventListener("pointerleave", () => {
    iceStage.querySelectorAll(".ice, .callout").forEach((item) => {
      item.style.translate = "0 0";
    });
  });
}

if (cinematic) {
  cinematic.addEventListener("pointermove", (event) => {
    applyPointerDepth(event, cinematic, ".scene", 10);
  });
  cinematic.addEventListener("pointerleave", () => {
    cinematic.querySelectorAll(".scene").forEach((item) => {
      item.style.translate = "0 0";
    });
  });
}
