import {PLAYBACK_SET_STOPPED} from '../actions/action-types';

function onStop(store) {
  return () => {
    store.dispatch({type: PLAYBACK_SET_STOPPED});
  }
}

export function initPlayerEvents(store) {
  return {
    onStop: onStop(store)
  };
}
