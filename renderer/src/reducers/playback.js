import {
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_PLAY
} from '../actions/action-types';

const initialState = {
  autoPlay: false,
  isPlaying: false,
  volume: 0.8 // 0.0 - 1.0
};

export default function playback(state = initialState, action) {
  switch (action.type) {
    case PLAYBACK_TOGGLE_AUTO_PLAY:
      // if autoplay is turned on, turn on playback too
      return {
        ...state,
        autoPlay: !state.autoPlay,
        isPlaying: !state.autoPlay || state.isPlaying
      };
    case PLAYBACK_TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    default:
      return state;
  }
}
