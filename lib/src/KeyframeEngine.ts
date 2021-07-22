import TWEEN from "@tweenjs/tween.js";

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

export class Timeline {
  private _start: number;
  private _end: number;
  private _length: number;
  private _returnToLastClickedOnPause: boolean;
  private _loop: boolean;
  private _lastClicked: number;
  private _current: number;
  private _playback: boolean;
  private _timeListener: (time: number) => void;
  private __timeToSubtract: number;

  constructor(length: number) {
    this._start = 0;
    this._end = length;
    this._length = length;
    this._returnToLastClickedOnPause = true;
    this._loop = true;
    this._current = 0;
    this._lastClicked = 0;
    this._playback = false;
    this.__timeToSubtract = 0;
  }

  lastClicked(t: number) {
    if (t <= this._end && t >= this._start) {
      this._lastClicked = t;
    }

    return this;
  }

  init() {
    this._playback = true;
    requestAnimationFrame((time) => this.update(time));
  }

  pause() {
    this._playback = false;
  }

  continue() {
    this._playback = true;
  }

  onUpdate(action: (time: number) => void) {
    this._timeListener = action;
  }

  update(time: number) {
    if (this._current <= this._end) {
      if (this._playback) {
        let playbackTime = Math.floor(time - this.__timeToSubtract);
        this._current = playbackTime;
        this._timeListener(this._current);
      } else {
        this.__timeToSubtract = time - this._current;
      }
    } else if (this._loop) {
      this.__timeToSubtract = time;
      this._current = this._start;
    }
    requestAnimationFrame((time) => this.update(time));
  }

  get t() {
    return this._current;
  }
}

export class KeyframeEngine {
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
