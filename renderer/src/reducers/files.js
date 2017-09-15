import {LOAD_FILES, LOAD_FILES_SUCCESS} from '../actions/action-types';

const initialState = {
  loading: false,
  files: []
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
