import {arraysAreSame} from './array-utils';

export function debounce(time, callback) {
  let timer = null;
  let lastArgs = [];

  return function() {
    const args = [...arguments];

    // if the arguments are the same as the last call, do nothing
    if (arraysAreSame(args, lastArgs)) {
      return;
    }
    lastArgs = args;

    // if there is a timer, clear it
    if (timer) {
      clearTimeout(timer);
    }

    // call the callback with a timeout
    timer = setTimeout(() => {
      callback.apply(null, args);
      timer = null;
    }, time);
  }
}

export function throttle(time, callback) {
  let timer = null;
  let lastArgs = [];

  return function() {
    lastArgs = [...arguments];
    if (!timer) {
      timer = setTimeout(() => {
        callback.apply({}, lastArgs);
        timer = null;
      }, time);
    }
  }
}
