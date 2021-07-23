import { v4 as uuidv4 } from "uuid";

type playbackEvents = "play" | "pause" | "stop";

type TimeListener = (time: number) => void;

interface TimeListenerList {
  [key: string]: TimeListener;
}

export default class Timeline {
  //options
  private _loop: boolean;
  private _speed: number;
  private _length: number;

  //time
  private _start: number;
  private _end: number;
  private _current: number;
  private _playback: boolean;

  //events
  private _timeListeners: TimeListenerList;
  private _playbackListener: (event: playbackEvents, time: number) => void;

  //util
  private __timeToSubtract: number;
  private __animationId: number;
  private __timeTillFirstPlay: number;
  private __firstPlayed: boolean;

  constructor(length: number, loop: boolean, speed: number) {
    this._start = 0;
    this._end = length;
    this._length = length;
    this._loop = loop;
    this._speed = speed;
    this._current = 0;
    this._playback = false;
    this.__timeToSubtract = 0;
    this.__firstPlayed = false;
    this.__timeTillFirstPlay = new Date().getTime();
  }

  get t() {
    return this._current;
  }

  get end() {
    return this._end;
  }

  setTime(time: number) {
    this._current = time;
  }

  setStart(time: number) {
    this._start = time;
  }

  setEnd(time: number) {
    this._end = time;
  }

  /**
   * starts playback of the timeline
   */
  play() {
    if (!this.__firstPlayed) {
      this.__timeToSubtract = new Date().getTime() - this.__timeTillFirstPlay;
      this.__firstPlayed = true;
    }
    if (this._playbackListener) this._playbackListener("play", this._current); //isnt paused
    this._playback = true;
    if (!this.__animationId) {
      this.__animationId = requestAnimationFrame((time) => this.update(time));
    }
  }

  /**
   * pauses playback of the timeline
   */
  pause() {
    if (this._playbackListener) this._playbackListener("pause", this._current); //is paused
    this._playback = false;
  }

  /**
   * stops playback and goes back to beginning
   */
  stop() {
    this._current = this._start;
    if (this._playbackListener) this._playbackListener("stop", this._current); //is paused
    if (this._timeListeners) this._triggerAllTimeListeners();
    this._playback = false;
  }

  /**
   * define an action for when _playback changing
   * @param action
   */
  onPlaybackChange(action: (event: playbackEvents, time: number) => void) {
    this._playbackListener = action;
  }

  /**
   * define an action for when the time is changing
   * @param action
   */
  onUpdate(action: (time: number) => void) {
    this._timeListeners = { ...this._timeListeners, [uuidv4()]: action };
  }

  /**
   * is called in the animationLoop and progresses the time of the timeline.
   * since the requestAnimationFrame time is continous, the elapsed time
   * is stored in __timeToSubtract and is subtracted on playback.
   * @param time
   */
  private update(time: number) {
    if (this._current <= this._end) {
      if (this._playback) {
        let playbackTime = Math.floor(time - this.__timeToSubtract);
        this._current = playbackTime * this._speed;
        if (this._timeListeners) this._triggerAllTimeListeners();
      } else {
        this.__timeToSubtract = time - this._current;
      }
    } else {
      this.__timeToSubtract = time;
      this._current = this._start;
      if (!this._loop) {
        this.pause();
      }
    }
    this.__animationId = requestAnimationFrame((time) => this.update(time));
  }

  //triggers all listeners
  private _triggerAllTimeListeners() {
    Object.keys(this._timeListeners).forEach((key) => {
      this._timeListeners[key](this._current);
    });
  }
}
