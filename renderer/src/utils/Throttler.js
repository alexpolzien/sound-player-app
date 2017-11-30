export default class Throttler {
  constructor(time, callback) {
    this.timer = null;
    this.time = time;
    this.callback = callback;
    this.lastArgs = [];
  }

  throttle() {
    this.lastArgs = [...arguments];

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.callback.apply(null, this.lastArgs);
        this.timer = null;
      }, this.time);
    }
  }
}
