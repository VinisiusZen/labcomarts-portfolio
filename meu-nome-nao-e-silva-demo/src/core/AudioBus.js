const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class AudioBus {
  constructor(target = globalThis) {
    this.target = target;
    this.context = null;
    this.master = null;
    this.enabled = true;
    this.unlocked = false;
    this.lastPlayed = new Map();
    this.music = null;
    this.startCue = null;
  }

  setMusic(src) {
    if (!src || typeof this.target.Audio === "undefined") return;
    this.music = new this.target.Audio(src);
    this.music.loop = true;
    this.music.volume = 0.42;
    this.music.preload = "auto";
  }

  setStartCue(src) {
    if (!src || typeof this.target.Audio === "undefined") return;
    this.startCue = new this.target.Audio(src);
    this.startCue.loop = false;
    this.startCue.volume = 0.58;
    this.startCue.preload = "auto";
  }

  async unlock() {
    const AudioContext = this.target.AudioContext || this.target.webkitAudioContext;
    if (!this.enabled || this.unlocked || !AudioContext) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 0.38;

    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 7;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;

    this.master.connect(compressor);
    compressor.connect(this.context.destination);
    await this.context.resume();
    this.unlocked = true;
    this.play("menuSelect", 0.45);
  }

  async startMusic() {
    if (!this.music) return;
    try {
      await this.music.play();
    } catch {
      this.play("menuSelect", 0.5);
    }
  }

  async playStartCue() {
    if (this.startCue) {
      try {
        this.startCue.currentTime = 0;
        await this.startCue.play();
        return;
      } catch {
        this.play("pressStart", 1);
        return;
      }
    }
    this.play("pressStart", 1);
  }

  play(name, intensity = 1) {
    if (!this.context || !this.master || !this.enabled) return;
    const now = this.context.currentTime;
    const previous = this.lastPlayed.get(name) || 0;
    if (now - previous < 0.035) return;
    this.lastPlayed.set(name, now);

    const amount = clamp(intensity, 0.25, 1.8);
    const sounds = {
      menuMove: () => this.tone({ frequency: 116, endFrequency: 92, duration: 0.055, gain: 0.07 * amount, type: "triangle" }),
      menuSelect: () => this.tone({ frequency: 148, endFrequency: 74, duration: 0.11, gain: 0.16 * amount, type: "triangle" }),
      pressStart: () => {
        this.tone({ frequency: 98, endFrequency: 147, duration: 0.22, gain: 0.18 * amount, type: "triangle" });
        this.noise({ duration: 0.18, gain: 0.06 * amount, filter: 420, type: "bandpass" });
      },
      combatStart: () => this.noise({ duration: 0.42, gain: 0.1 * amount, filter: 180, type: "lowpass" }),
      attackLight: () => this.sweep({ start: 620, end: 230, duration: 0.08, gain: 0.12 * amount }),
      attackHeavy: () => this.sweep({ start: 420, end: 92, duration: 0.16, gain: 0.2 * amount }),
      hitLight: () => this.impact({ low: 120, high: 1280, duration: 0.11, gain: 0.18 * amount }),
      hitHeavy: () => this.impact({ low: 74, high: 940, duration: 0.18, gain: 0.25 * amount }),
      breaker: () => {
        this.impact({ low: 58, high: 720, duration: 0.24, gain: 0.3 * amount });
        this.tone({ frequency: 96, endFrequency: 42, duration: 0.24, gain: 0.18 * amount, type: "sawtooth" });
      },
      grab: () => this.impact({ low: 88, high: 520, duration: 0.13, gain: 0.2 * amount }),
      pulse: () => {
        this.tone({ frequency: 72, endFrequency: 42, duration: 0.54, gain: 0.2 * amount, type: "sine" });
        this.noise({ duration: 0.5, gain: 0.08 * amount, filter: 520, type: "bandpass" });
      },
      enemyAttack: () => this.sweep({ start: 360, end: 130, duration: 0.1, gain: 0.12 * amount }),
      playerHit: () => this.impact({ low: 64, high: 620, duration: 0.2, gain: 0.28 * amount }),
      enemySpawn: () => this.tone({ frequency: 92, endFrequency: 128, duration: 0.16, gain: 0.1 * amount, type: "triangle" }),
      pause: () => this.tone({ frequency: 180, endFrequency: 90, duration: 0.12, gain: 0.12 * amount, type: "sine" }),
      victory: () => {
        this.tone({ frequency: 110, endFrequency: 165, duration: 0.42, gain: 0.13 * amount, type: "triangle" });
        this.tone({ frequency: 220, endFrequency: 247, duration: 0.52, gain: 0.08 * amount, type: "sine", delay: 0.12 });
      },
      defeat: () => {
        this.tone({ frequency: 110, endFrequency: 38, duration: 0.62, gain: 0.2 * amount, type: "sawtooth" });
        this.noise({ duration: 0.5, gain: 0.1 * amount, filter: 160, type: "lowpass" });
      }
    };

    sounds[name]?.();
  }

  tone({ frequency, endFrequency, duration, gain, type = "sine", delay = 0 }) {
    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope);
    envelope.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  sweep({ start, end, duration, gain }) {
    this.tone({ frequency: start, endFrequency: end, duration, gain, type: "sawtooth" });
    this.noise({ duration, gain: gain * 0.6, filter: start, type: "highpass" });
  }

  impact({ low, high, duration, gain }) {
    this.tone({ frequency: low, endFrequency: Math.max(28, low * 0.48), duration, gain, type: "triangle" });
    this.noise({ duration: duration * 0.72, gain: gain * 0.8, filter: high, type: "bandpass" });
  }

  noise({ duration, gain, filter, type }) {
    const now = this.context.currentTime;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.7);
    }

    const source = this.context.createBufferSource();
    const envelope = this.context.createGain();
    const filterNode = this.context.createBiquadFilter();
    filterNode.type = type;
    filterNode.frequency.value = filter;
    filterNode.Q.value = 0.8;
    envelope.gain.setValueAtTime(gain, now);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.buffer = buffer;
    source.connect(filterNode);
    filterNode.connect(envelope);
    envelope.connect(this.master);
    source.start(now);
    source.stop(now + duration);
  }
}
