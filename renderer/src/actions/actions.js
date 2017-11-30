import {
  LIST_SELECT_FILE
} from './action-types';

export function selectFile(id) {
  return {
    type: LIST_SELECT_FILE,
    id
  };
}
