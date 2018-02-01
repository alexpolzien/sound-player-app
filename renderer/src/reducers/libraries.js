import {
  LIBRARY_SET_ID,
  LIBRARIES_UPDATED
} from '../actions/action-types';

const initialState = {
  libraries: {},
  selectedId: null
};

export default function libraries(state = initialState, action) {
  switch (action.type) {
    case LIBRARY_SET_ID:
      return {
        ...state,
        selectedId: action.id
      };
    case LIBRARIES_UPDATED:
      return {
        ...state,
        libraries: action.libraries
      };
    default:
      return state;
  }
}
