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

  play() {
    this._timeline.onUpdate((t) => {
      this._layers.forEach((layer) => {
        layer.elements.forEach((el) => {
          if (el.keyframes) {
            const currentElement = document.getElementById(el.id);

            el.keyframes.forEach((kfb) => {
              kfb.keyframes.forEach((keyframe, index) => {
                if (t <= keyframe.to.t && t >= keyframe.from.t) {
                  const deltaT = Math.abs(keyframe.to.t - keyframe.from.t);
                  const deltaV = Math.abs(keyframe.to.v - keyframe.from.v);
                  const rate = deltaV / deltaT;

                  if (rate !== 0) {
                    let lastTime = 0;
                    if (index > 0) {
                      lastTime = kfb.keyframes[index - 1].to.t;
                    }
                    //WIP: can only go forward with keyframe
                    const timeDiff = t - lastTime;
                    const step =
                      keyframe.from.v < keyframe.to.v
                        ? Math.floor(rate * timeDiff)
                        : Math.floor(rate * (this._timeline.end - timeDiff));

                    console.log(step);
                    el = { ...el, [kfb.prop]: step };
                    currentElement.setAttribute(kfb.prop, step + "");
                  }
                }
              });
            });
          }
        });
      });
    });
  }
}
