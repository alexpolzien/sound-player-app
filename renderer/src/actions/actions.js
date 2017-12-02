import {
  LIST_SELECT_FILE,
  PLAYBACK_SET_VOLUME,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_PLAY
} from './action-types';

export function selectFile(id) {
  return {
    type: LIST_SELECT_FILE,
    id
  };
}

export function setVolume(level) {
  return {
    type: PLAYBACK_SET_VOLUME,
    level: level
  };
}

export function toggleAutoPlay() {
  return {type: PLAYBACK_TOGGLE_AUTO_PLAY};
}

export function togglePlayback() {
  return {type: PLAYBACK_TOGGLE_PLAY};
}
