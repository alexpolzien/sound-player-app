import {
  TAGS_FETCH_ERROR,
  TAGS_FETCH_START,
  TAGS_FETCH_SUCCESS,
  TAGS_SELECT_ID,
  TAGS_UNSELECT_ID
} from '../actions/action-types';
import {copyWithoutEntries} from '../utils/object-utils';

const initialState = {
  tags: {},
  selectedIds: {},
  status: 'init'
};

export default function tags(state = initialState, action) {
  switch (action.type) {
    case TAGS_FETCH_ERROR:
      return {
        ...state,
        status: 'error'
      };
    case TAGS_FETCH_START:
      return {
        ...state,
        status: 'loading'
      };
    case TAGS_FETCH_SUCCESS:
      return {
        ...state,
        status: 'loaded',
        tags: action.tags
      };
    case TAGS_SELECT_ID:
      return {
        ...state,
        selectedIds: {
          ...state.selectedIds,
          [action.id]: true
        }
      };
    case TAGS_UNSELECT_ID:
      const ids = {...state.selectedIds};
      delete ids[action.id];
      return {
        ...state,
        selectedIds: ids
      };
    default:
      return state;
  }
}
