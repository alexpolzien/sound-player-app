import {combineReducers} from 'redux';

import activePanels from './active-panels';
import audioBuffer from './audio-buffer';
import files from './files';
import imports from './imports';
import playback from './playback';
import resultsList from './results-list';

export default combineReducers({
  activePanels,
  audioBuffer,
  files,
  imports,
  playback,
  resultsList
});
