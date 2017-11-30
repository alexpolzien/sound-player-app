import {
  DB_LOAD_INITIAL_RESULTS_SUCCESS,
  LIST_SELECT_FILE
} from '../actions/action-types';

const initialState = {
  files: {},
  selectedId: null
};

export default function resultsList(state = initialState, action) {
  switch (action.type) {
    case DB_LOAD_INITIAL_RESULTS_SUCCESS:
      const files = {};
      action.results.forEach(result => {
        files[result.id] = result;
      });
      return {
        ...state,
        files
      };
    case LIST_SELECT_FILE:
      return {
        ...state,
        selectedId: action.id
      };
    default:
      return state;
  }
}
