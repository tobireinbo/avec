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
  id: string;
  type: string;
  pos: { x: number; y: number };
  scale: number;
  z: number;
  keyframes?: Array<KeyframeBind>;
}

interface Layer extends Element {
  elements: Array<Element>;
}

export default class KeyframeEngine {
  private _layers: Array<Layer>;
  private _currentLayer: Layer;
  private _timeline: Timeline;
  private _svgElement: HTMLElement;

  constructor(timeline: Timeline, svgElement: HTMLElement) {
    this._layers = [];
    this._timeline = timeline;
    this._svgElement = svgElement;
  }

  get layers() {
    return this._layers;
  }

  addLayer(layer: Layer) {
    this._layers.push(layer);
    const currentEl = layer.elements[0];
    const testElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      currentEl.type
    );

    testElement.setAttribute("id", "rec1");
    testElement.setAttribute("width", 100 + "");
    testElement.setAttribute("height", 80 + "");
    testElement.setAttribute("x", 5 + "");
    testElement.setAttribute("y", 5 + "");
    testElement.style.fill = "rgb(0, 0, 255)";

    this._svgElement.appendChild(testElement);
    return this;
  }

  focusLayer(id: string) {
    this._currentLayer = this._layers.find((l) => l.id === id);

    return this._currentLayer;
  }

  playLayers() {
    this._timeline.onUpdate((t) => {
      console.log(t);
      document.getElementById("rec1").setAttribute("x", t * 0.01 + "");
    });
  }
}
