import {
  SELECT_FILE
} from '../actions/action-types';

const initialState = {
  loading: false,
  files: [],
  selectedFile: null // TODO is this used?
};

export default function files(state = initialState, action) {
  switch (action.type) {
    
    default:
      return state;
  }
}
