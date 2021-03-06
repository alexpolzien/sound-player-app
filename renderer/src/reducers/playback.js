import {
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_CYCLE_PLAY
} from '../actions/action-types';

const initialState = {
  autoPlay: false,
  cyclePlay: false,
  isPlaying: false
};

export default function playback(state = initialState, action) {
  switch (action.type) {
    case PLAYBACK_SET_PLAYING:
      return {
        ...state,
        isPlaying: true
      };
    case PLAYBACK_SET_STOPPED:
      return {
        ...state,
        isPlaying: false
      };
    case PLAYBACK_TOGGLE_AUTO_PLAY:
      return {
        ...state,
        autoPlay: !state.autoPlay
      };
    case PLAYBACK_TOGGLE_CYCLE_PLAY:
      return {
        ...state,
        cyclePlay: !state.cyclePlay
      };
    default:
      return state;
  }
}
