import {BUFFER_FETCHED_FROM_CACHE_SUCCESS} from '../actions/action-types';

const initialState = {
  file: null,
  buffer: null
};

export default function audioBuffer(state = initialState, action) {
  switch (action.type) {
    case BUFFER_FETCHED_FROM_CACHE_SUCCESS:
      return {
        ...state,
        file: action.file,
        buffer: action.buffer
      };
    default:
      return state;
  }
}
