import {LOAD_FILES_SUCCESS} from '../actions/action-types';

const initialState = {
  loading: false,
  files: []
};

export default function files(state = initialState, action) {
  switch (action.type) {
    case LOAD_FILES_SUCCESS:
      console.log(action);
      return state;
  }
  return state;
}
