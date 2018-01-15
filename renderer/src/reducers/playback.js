import {
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_AUTO_PLAY
} from '../actions/action-types';

const initialState = {
  autoPlay: false,
  isPlaying: false
};

export default function playback(state = initialState, action) {
  /*switch (action.type) {
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
  }*/

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
    default:
      return state;
  }
}
