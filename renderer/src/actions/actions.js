import {
  PLAYBACK_SET_VOLUME,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_PLAY,
  RESULTS_SET_SORT_DIRECTION,
  RESULTS_SET_SORT_TYPE,
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

export function setResultsSortType(sortType) {
  return {
    type: RESULTS_SET_SORT_TYPE,
    sortType
  };
}

export function setResultsSortDirection(direction) {
  return {
    type: RESULTS_SET_SORT_DIRECTION,
    direction
  };
}
