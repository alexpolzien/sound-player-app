import {
  PLAYBACK_TOGGLE_PLAY
} from '../actions/action-types';

const initialState = {
  isPlaying: false
};

export default function playback(state = initialState, action) {
  switch (action.type) {
    case PLAYBACK_TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    default:
      return state;
  }
}
