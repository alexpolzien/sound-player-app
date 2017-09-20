import {
  DECODE_FILE_SUCCESS
} from '../actions/action-types';

const initialState = {};

export default function bufferCache(state = initialState, action) {
  switch (action.type) {
    case DECODE_FILE_SUCCESS:
      const fileId = action.file.id;
      const bufferData = action.data;
      return {
        ...state,
        [fileId]: bufferData
      };
    default:
      return state;
  }
}
