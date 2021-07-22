type playbackEvents = "play" | "pause" | "stop";

export default class Timeline {
  private _start: number;
  private _end: number;
  private _length: number;
  private _loop: boolean;
  private _current: number;
  private _playback: boolean;
  private _timeListener: (time: number) => void;
  private _playbackListener: (event: playbackEvents, time: number) => void;

  private __timeToSubtract: number;
  private __animationId: number;
  private __timeTillFirstPlay: number;
  private __firstPlay: boolean;

  constructor(length: number) {
    this._start = 0;
    this._end = length;
    this._length = length;
    this._loop = true;
    this._current = 0;
    this._playback = false;

    this.__timeToSubtract = 0;
    this.__firstPlay = false;
    this.__timeTillFirstPlay = new Date().getTime();
  }

  get t() {
    return this._current;
  }

  get end() {
    return this._end;
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
    if (!this.__firstPlay) {
      this.__timeToSubtract = new Date().getTime() - this.__timeTillFirstPlay;
      this.__firstPlay = true;
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

  stop() {
    this._current = this._start;
    if (this._playbackListener) this._playbackListener("stop", this._current); //is paused
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
    this._timeListener = action;
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
        this._current = playbackTime;
        if (this._timeListener) this._timeListener(this._current);
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
}
