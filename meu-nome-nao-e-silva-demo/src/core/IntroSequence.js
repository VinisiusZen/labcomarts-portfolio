const DEFAULT_DURATION = 5400;
const IMAGE_OUT_MS = 850;
const TEXT_OUT_MS = 700;

export class IntroSequence {
  constructor({ root, slides, onComplete }) {
    this.root = root;
    this.slides = slides;
    this.onComplete = onComplete;
    this.index = 0;
    this.timers = [];
    this.raf = 0;
    this.finished = false;
    this.previousGamepadPressed = false;
    this.skip = this.skip.bind(this);
    this.pollGamepad = this.pollGamepad.bind(this);
  }

  start() {
    this.root.innerHTML = `
      <section class="intro-screen" aria-label="Opening story intro">
        <div class="intro-image-wrap" data-intro-wrap>
          <img class="intro-image" data-intro-image alt="" />
        </div>
        <p class="intro-caption" data-intro-caption></p>
      </section>
    `;
    this.screen = this.root.querySelector(".intro-screen");
    this.imageWrap = this.root.querySelector("[data-intro-wrap]");
    this.image = this.root.querySelector("[data-intro-image]");
    this.caption = this.root.querySelector("[data-intro-caption]");
    this.bindSkip();
    this.showSlide(0);
    this.raf = requestAnimationFrame(this.pollGamepad);
  }

  dispose() {
    this.finished = true;
    this.clearTimers();
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.skip);
    window.removeEventListener("pointerdown", this.skip);
  }

  bindSkip() {
    window.addEventListener("keydown", this.skip);
    window.addEventListener("pointerdown", this.skip);
  }

  skip(event) {
    if (event?.type === "keydown" && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
    if (event?.target?.closest?.("[data-action='fullscreen']")) return;
    event?.preventDefault?.();
    this.finish();
  }

  pollGamepad() {
    if (this.finished) return;
    const pads = navigator.getGamepads?.() || [];
    const pressed = Array.from(pads).some((pad) => pad?.connected && pad.buttons.some((button) => button.pressed));
    if (pressed && !this.previousGamepadPressed) {
      this.finish();
      return;
    }
    this.previousGamepadPressed = pressed;
    this.raf = requestAnimationFrame(this.pollGamepad);
  }

  showSlide(index) {
    if (this.finished) return;
    const slide = this.slides[index];
    if (!slide) {
      this.finish();
      return;
    }

    this.index = index;
    this.clearTimers();
    this.screen.dataset.slide = String(index + 1);
    this.imageWrap.className = `intro-image-wrap ${slide.drift || "slow-in"}`;
    this.caption.className = `intro-caption ${slide.placement || "lower-left"}`;
    this.caption.textContent = slide.caption;
    this.image.src = slide.image;
    this.image.alt = "";

    this.screen.classList.remove("is-image-in", "is-text-in", "is-text-out", "is-image-out");

    this.timers.push(setTimeout(() => this.screen.classList.add("is-image-in"), 50));
    this.timers.push(setTimeout(() => this.screen.classList.add("is-text-in"), slide.textDelay ?? 1100));

    const duration = slide.duration ?? DEFAULT_DURATION;
    this.timers.push(setTimeout(() => this.screen.classList.add("is-text-out"), Math.max(1200, duration - IMAGE_OUT_MS - TEXT_OUT_MS)));
    this.timers.push(setTimeout(() => this.screen.classList.add("is-image-out"), Math.max(1700, duration - IMAGE_OUT_MS)));
    this.timers.push(setTimeout(() => this.showSlide(index + 1), duration));
  }

  clearTimers() {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers = [];
  }

  finish() {
    if (this.finished) return;
    this.dispose();
    this.root.querySelector(".intro-screen")?.classList.add("is-finished");
    setTimeout(() => this.onComplete?.(), 180);
  }
}
