import TWEEN from "@tweenjs/tween.js";
import Timeline from "./Timeline";

interface Keyframe {
  time: number;
  val: number;
}

interface KeyframeBind {
  prop: string;
  keyframes: Array<Keyframe>;
}

interface Element {
  pos: { x: number; y: number };
  scale: number;
  z: number;
  keyframes: Array<KeyframeBind>;
}

interface Layer extends Element {
  id: string;
  elements: Array<Element>;
}

export default class KeyframeEngine {
  private _layers: Array<Layer>;
  private _currentLayer: Layer;
  private _timeline: Timeline;

  constructor(timeline: Timeline) {
    this._layers = [];
    this._timeline = timeline;
  }

  get layers() {
    return this._layers;
  }

  addLayer(layer: Layer) {
    this._layers.push(layer);

    return this;
  }

  focusLayer(id: string) {
    this._currentLayer = this._layers.find((l) => l.id === id);

    return this._currentLayer;
  }
}
