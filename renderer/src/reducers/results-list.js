import {
  DB_LOAD_INITIAL_RESULTS_SUCCESS,
  LIST_SELECT_FILE_ID,
  RESULTS_SET_SORT_DIRECTION,
  RESULTS_SET_SORT_TYPE
} from '../actions/action-types';
import {splitAtTail} from '../utils/array-utils';
import {getSortedFilesArray, SORT_ASC, SORT_FILE_NAME} from '../utils/file-sort-utils';

const initialState = {
  files: {},
  selectedId: null,
  selectRanges: [],
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
      let selectRanges;
      if (action.newRange) {
        selectRanges = [
          ...state.selectRanges,
          {startId: action.id, endId: action.id}
        ];
      } else if (action.addToRange) {
        let [head, tail] = splitAtTail(state.selectRanges);
        if (tail === null) {
          tail = {startId: action.id, endId: action.id};
        } else {
          tail = {...tail, endId: action.id};
        }
        selectRanges = head.concat(tail);
      } else {
        selectRanges = [{startId: action.id, endId: action.id}];
      }

      return {
        ...state,
        selectedId: action.id,
        selectRanges
      };
    case RESULTS_SET_SORT_DIRECTION:
      // TODO: reset ranges
      return {
        ...state,
        sort: {
          ...state.sort,
          direction: action.direction
        }
      };
    case RESULTS_SET_SORT_TYPE:
      // TODO: reset ranges
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
