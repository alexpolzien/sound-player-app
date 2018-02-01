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
      return {
        ...state,
        selectedId: action.savedState.libraries.selectedId
      };
    case LIBRARY_SET_ID:
      return {
        ...state,
        selectedId: action.id
      };
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
