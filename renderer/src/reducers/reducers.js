import {combineReducers} from 'redux';

import audioBuffer from './audio-buffer';
import files from './files';
import imports from './imports';
import playback from './playback';
import resultsList from './results-list';

export default combineReducers({
  audioBuffer,
  files,
  imports,
  playback,
  resultsList
});
