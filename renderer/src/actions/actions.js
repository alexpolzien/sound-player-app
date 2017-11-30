import {
  LIST_SELECT_FILE,
  PLAYBACK_TOGGLE_PLAY
} from './action-types';

export function selectFile(id) {
  return {
    type: LIST_SELECT_FILE,
    id
  };
}

export function togglePlayback() {
  return {type: PLAYBACK_TOGGLE_PLAY};
}
