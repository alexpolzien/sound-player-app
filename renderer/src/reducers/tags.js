import {
  TAGS_FETCH_ERROR,
  TAGS_FETCH_START,
  TAGS_FETCH_SUCCESS
} from '../actions/action-types';

const initialState = {
  tags: {},
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
    default:
      return state;
  }
}
