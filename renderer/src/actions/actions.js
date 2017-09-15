import {SELECT_FILE} from './action-types';

export function selectFile(filename) {
  return {
    type: SELECT_FILE,
    filename: filename
  };
}
