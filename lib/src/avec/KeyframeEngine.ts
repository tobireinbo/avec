import TWEEN from "@tweenjs/tween.js";
import Timeline from "./Timeline";

interface Keyframe {
  to: { t: number; v: number };
  from: { t: number; v: number };
}

interface _Keyframe {
  t: number;
  v: number;
}

interface KeyframeBind {
  prop: string;
  keyframes: Array<Keyframe>;
}

interface SharedProps {
  id: string;
  x: number;
  y: number;
  scale: number;
  z: number;
  keyframes?: Array<KeyframeBind>;
  elements?: Array<Element>;
}
interface Element extends SharedProps {
  type: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

interface Layer extends SharedProps {}

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

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    layer.elements.forEach((el) => {
      const currentElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        el.type
      );

      currentElement.setAttribute("id", el.id);
      currentElement.setAttribute("width", el.width + "");
      currentElement.setAttribute("height", el.height + "");
      currentElement.setAttribute("x", el.x + "");
      currentElement.setAttribute("y", el.y + "");
      currentElement.style.fill = el.backgroundColor;

      group.appendChild(currentElement);
    });

    this._svgElement.appendChild(group);
    return this;
  }

  focusLayer(id: string) {
    this._currentLayer = this._layers.find((l) => l.id === id);

    return this._currentLayer;
  }

  //find keyframe to the left and right of t and calc the position
  //Or create a math function that takes input t and returns current val
  play() {
    this._timeline.onUpdate((t) => {
      this._layers.forEach((layer) => {
        layer.elements.forEach((el) => {
          if (el.keyframes) {
            const currentElement = document.getElementById(el.id);

            el.keyframes.forEach((kfb) => {
              kfb.keyframes.forEach((keyframe, index) => {
                if (t <= keyframe.to.t && t >= keyframe.from.t) {
                  const step = KeyframeEngine.keyframeFunction(
                    t,
                    keyframe.from.v,
                    keyframe.to.v,
                    keyframe.from.t,
                    keyframe.to.t
                  );
                  console.log(step);
                  currentElement.setAttribute(kfb.prop, step + "");
                }
              });
            });
          }
        });
      });
    });
  }

  private static keyframeFunction(
    t: number,
    v0: number,
    v1: number,
    t0: number,
    t1: number
  ) {
    const rate = (v1 - v0) / (t1 - t0);
    return rate * t + (v0 - t0 * rate);
  }
}
