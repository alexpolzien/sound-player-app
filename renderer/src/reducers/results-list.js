import {
  DB_LOAD_INITIAL_RESULTS_SUCCESS
} from '../actions/action-types';

const initialState = {
  files: {}
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
    default:
      return state;
  }
}
