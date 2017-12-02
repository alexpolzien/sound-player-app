import {combineReducers} from 'redux';

import audioBuffer from './audio-buffer';
import files from './files';
import playback from './playback';
import resultsList from './results-list';

export default combineReducers({
  audioBuffer,
  files,
  playback,
  resultsList
});
