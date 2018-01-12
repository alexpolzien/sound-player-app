import {
  LOAD_FILES,
  LOAD_FILES_SUCCESS,
  SELECT_FILE
} from '../actions/action-types';

const initialState = {
  loading: false,
  files: [],
  selectedFile: null // TODO is this used?
};

export default function files(state = initialState, action) {
  switch (action.type) {
    case LOAD_FILES_SUCCESS:
      return {
        ...state,
        loading: false,
        files: action.files
      };
    default:
      return state;
  }
}
