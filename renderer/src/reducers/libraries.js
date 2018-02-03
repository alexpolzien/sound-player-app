import {
  APP_STATE_RECALLED,
  LIBRARY_SET_ID,
  LIBRARIES_FETCH_ALL_ERROR,
  LIBRARIES_FETCH_ALL_START,
  LIBRARIES_FETCH_ALL_SUCCESS
} from '../actions/action-types';

const initialState = {
  libraries: {},
  selectedId: null,
  status: 'init'
};

export default function libraries(state = initialState, action) {
  switch (action.type) {
    case APP_STATE_RECALLED:
      if (action.savedState.libraries.selectedId) {
        return {
          ...state,
          selectedId: action.savedState.libraries.selectedId
        };
      } else {
        return state;
      }
    case LIBRARY_SET_ID:
      if (action.libraryId in state.libraries) {
        return {
          ...state,
          selectedId: action.libraryId
        };
      } else {
        return state;
      }
    case LIBRARIES_FETCH_ALL_ERROR:
      return {
        ...state,
        status: 'error'
      };
    case LIBRARIES_FETCH_ALL_START:
      return {
        ...state,
        status: 'loading'
      };
    case LIBRARIES_FETCH_ALL_SUCCESS:
      return {
        ...state,
        status: 'loaded',
        libraries: action.libraries
      };
    default:
      return state;
  }
}
