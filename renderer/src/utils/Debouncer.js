import {arraysAreSame} from './array-utils';

export default class Debouncer {
  constructor(time, callback) {
    this.timer = null;
    this.time = time;
    this.callback = callback;
    this.lastArgs = [];
  }

  debounce() {
    // if the arguments are the same as the last call, do nothing
    const args = [...arguments];
    if (arraysAreSame(args, this.lastArgs)) {
      return;
    }
    this.lastArgs = args;

    // if there is a timer, clear it
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // call the callback with a timeout
    this.timer = setTimeout(() => {
      this.callback.apply(null, args);
    }, this.time);
  }
}
