const KEY_BINDINGS = {
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  up: ["ArrowUp", "KeyW"],
  down: ["ArrowDown", "KeyS"],
  run: ["ShiftLeft", "ShiftRight"],
  jump: ["Space"],
  dodge: ["KeyL"],
  light: ["KeyJ"],
  heavy: ["KeyK"],
  special: ["KeyI", "KeyU"],
  grab: ["KeyE"],
  pickup: ["KeyP"],
  star: ["KeyO"],
  pulse: ["KeyQ"],
  restart: ["KeyR"],
  pause: ["Escape"]
};

const GAMEPAD_BUTTONS = {
  0: "jump",
  1: "dodge",
  2: "light",
  3: "heavy",
  4: "pulse",
  5: "grab",
  6: "special",
  7: "run",
  8: "restart",
  9: "pause",
  10: "run",
  11: "star",
  12: "up",
  13: "down",
  14: "left",
  15: "right"
};

const AXIS_DEADZONE = 0.28;
const RUN_AXIS_THRESHOLD = 0.78;

export class Input {
  constructor(target = window) {
    this.target = target;
    this.keyboardDown = new Set();
    this.gamepadDown = new Set();
    this.pressed = new Set();
    this.enabled = false;
    this.gamepadAxisX = 0;
    this.gamepadAxisLane = 0;
    this.gamepadName = "";
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    if (this.enabled) return;
    this.enabled = true;
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
  }

  detach() {
    if (!this.enabled) return;
    this.enabled = false;
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    this.keyboardDown.clear();
    this.gamepadDown.clear();
    this.pressed.clear();
    this.gamepadAxisX = 0;
    this.gamepadAxisLane = 0;
  }

  onKeyDown(event) {
    const action = this.actionFor(event.code);
    if (!action) return;
    event.preventDefault();
    if (!this.isDown(action)) this.pressed.add(action);
    this.keyboardDown.add(action);
  }

  onKeyUp(event) {
    const action = this.actionFor(event.code);
    if (!action) return;
    event.preventDefault();
    this.keyboardDown.delete(action);
  }

  actionFor(code) {
    return Object.entries(KEY_BINDINGS).find(([, codes]) => codes.includes(code))?.[0] || null;
  }

  isDown(action) {
    return this.keyboardDown.has(action) || this.gamepadDown.has(action);
  }

  wasPressed(action) {
    return this.pressed.has(action);
  }

  axisX() {
    const keyboardAxis = (this.keyboardDown.has("right") ? 1 : 0) - (this.keyboardDown.has("left") ? 1 : 0);
    if (keyboardAxis !== 0) return keyboardAxis;
    const digitalAxis = (this.gamepadDown.has("right") ? 1 : 0) - (this.gamepadDown.has("left") ? 1 : 0);
    return digitalAxis || this.gamepadAxisX;
  }

  axisLane() {
    const keyboardAxis = (this.keyboardDown.has("down") ? 1 : 0) - (this.keyboardDown.has("up") ? 1 : 0);
    if (keyboardAxis !== 0) return keyboardAxis;
    const digitalAxis = (this.gamepadDown.has("down") ? 1 : 0) - (this.gamepadDown.has("up") ? 1 : 0);
    return digitalAxis || this.gamepadAxisLane;
  }

  updateGamepad() {
    const gamepad = this.getPrimaryGamepad();
    const nextDown = new Set();
    let nextAxisX = 0;
    let nextAxisLane = 0;

    if (gamepad) {
      this.gamepadName = gamepad.id || "Gamepad";
      nextAxisX = this.normalizeAxis(gamepad.axes[0] || 0);
      nextAxisLane = this.normalizeAxis(gamepad.axes[1] || 0);

      if (nextAxisX <= -AXIS_DEADZONE) nextDown.add("left");
      if (nextAxisX >= AXIS_DEADZONE) nextDown.add("right");
      if (nextAxisLane <= -AXIS_DEADZONE) nextDown.add("up");
      if (nextAxisLane >= AXIS_DEADZONE) nextDown.add("down");
      if (Math.abs(nextAxisX) >= RUN_AXIS_THRESHOLD) nextDown.add("run");

      gamepad.buttons.forEach((button, index) => {
        if (!button.pressed) return;
        const action = GAMEPAD_BUTTONS[index];
        if (action) nextDown.add(action);
      });
    } else {
      this.gamepadName = "";
    }

    for (const action of nextDown) {
      if (!this.gamepadDown.has(action) && !this.keyboardDown.has(action)) this.pressed.add(action);
    }

    this.gamepadDown = nextDown;
    this.gamepadAxisX = nextAxisX;
    this.gamepadAxisLane = nextAxisLane;
  }

  getPrimaryGamepad() {
    const getGamepads = this.target.navigator?.getGamepads || globalThis.navigator?.getGamepads;
    if (!getGamepads) return null;
    const pads = getGamepads.call(this.target.navigator || globalThis.navigator);
    return Array.from(pads || []).find((pad) => pad?.connected) || null;
  }

  normalizeAxis(value) {
    if (Math.abs(value) < AXIS_DEADZONE) return 0;
    const direction = Math.sign(value);
    const normalized = (Math.abs(value) - AXIS_DEADZONE) / (1 - AXIS_DEADZONE);
    return direction * Math.min(1, normalized);
  }

  endFrame() {
    this.pressed.clear();
  }
}
