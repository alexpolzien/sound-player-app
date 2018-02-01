import {combineReducers} from 'redux';

import activePanels from './active-panels';
import audioBuffer from './audio-buffer';
import files from './files';
import imports from './imports';
import libraries from './libraries';
import playback from './playback';
import resultsList from './results-list';
import tags from './tags';

export default combineReducers({
  activePanels,
  audioBuffer,
  files,
  imports,
  libraries,
  playback,
  resultsList,
  tags
});
