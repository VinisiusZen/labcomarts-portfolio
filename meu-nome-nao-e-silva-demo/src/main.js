import { PrototypeApp } from "./core/App.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Missing #app root element.");
}

const app = new PrototypeApp(root);
app.boot();
