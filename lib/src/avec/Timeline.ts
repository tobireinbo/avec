export default class Timeline {
  private _start: number;
  private _end: number;
  private _length: number;
  private _loop: boolean;
  private _current: number;
  private _playback: boolean;
  private _timeListener: (time: number) => void;
  private _playbackListener: (paused: boolean) => void;
  private __timeToSubtract: number;
  private __animationId: number;

  constructor(length: number) {
    this._start = 0;
    this._end = length;
    this._length = length;
    this._loop = true;
    this._current = 0;
    this._playback = false;
    this.__timeToSubtract = 0;
  }

  get t() {
    return this._current;
  }

  /**
   * starts playback of the timeline
   */
  play() {
    if (this._playbackListener) this._playbackListener(false); //isnt paused
    this._playback = true;
    if (!this.__animationId) {
      this.__animationId = requestAnimationFrame((time) => this.update(time));
    }
  }

  /**
   * pauses playback of the timeline
   */
  pause() {
    if (this._playbackListener) this._playbackListener(true); //is paused
    this._playback = false;
  }

  /**
   * define an action for when _playback changing
   * @param action
   */
  onPlayback(action: (paused: boolean) => void) {
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
