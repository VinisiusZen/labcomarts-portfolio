import { assetManifest } from "../data/assets.js";

export class AssetRegistry {
  constructor(manifest = assetManifest) {
    this.manifest = manifest;
    this.images = new Map();
  }

  async preload() {
    const records = Object.values(this.manifest).flatMap((group) => Object.values(group));
    await Promise.all(records.filter((record) => record.type === "image").map((record) => this.loadImage(record)));
  }

  loadImage(record) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        this.images.set(record.id, image);
        resolve(image);
      };
      image.onerror = () => {
        console.warn(`Unable to load asset ${record.id} from ${record.src}`);
        resolve(null);
      };
      image.src = record.src;
    });
  }

  image(id) {
    return this.images.get(id) || null;
  }

  record(id) {
    return Object.values(this.manifest)
      .flatMap((group) => Object.values(group))
      .find((record) => record.id === id);
  }
}
