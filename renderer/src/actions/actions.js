import {
  PLAYBACK_SET_VOLUME,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_PLAY,
  SELECT_FILE
} from './action-types';

export function selectFile(file) {
  return {
    type: SELECT_FILE,
    file
  };
}

export function toggleAutoPlay() {
  return {type: PLAYBACK_TOGGLE_AUTO_PLAY};
}

export function togglePlayback() {
  return {type: PLAYBACK_TOGGLE_PLAY};
}
