import {
  PLAY_SELECTED,
  SELECT_FILE
} from './action-types';

export function selectFile(file) {
  return {
    type: SELECT_FILE,
    file
  };
}

export function playSelected() {
  return {type: PLAY_SELECTED};
}
