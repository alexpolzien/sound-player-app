import {
  SELECT_FILE
} from './action-types';

export function selectFile(file) {
  return {
    type: SELECT_FILE,
    file
  };
}
