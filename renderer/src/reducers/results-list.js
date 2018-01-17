import {
  DB_LOAD_INITIAL_RESULTS_SUCCESS,
  LIST_SELECT_FILE_ID,
  RESULTS_SET_SORT_DIRECTION,
  RESULTS_SET_SORT_TYPE
} from '../actions/action-types';
import {SORT_ASC, SORT_FILE_NAME} from '../utils/file-sort-utils';

const initialState = {
  files: {},
  selectedId: null,
  sort: {
    type: SORT_FILE_NAME,
    direction: SORT_ASC
  }
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
    case LIST_SELECT_FILE_ID:
      return {
        ...state,
        selectedId: action.id
      };
    case RESULTS_SET_SORT_DIRECTION:
      return {
        ...state,
        sort: {
          ...state.sort,
          direction: action.direction
        }
      };
    case RESULTS_SET_SORT_TYPE:
      return {
        ...state,
        sort: {
          ...state.sort,
          type: action.sortType
        }
      };
    default:
      return state;
  }
}
