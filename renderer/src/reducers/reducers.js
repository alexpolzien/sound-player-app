import {combineReducers} from 'redux';

import bufferCache from './buffer-cache';
import files from './files';
import playback from './playback';
import resultsList from './results-list';

export default combineReducers({
  bufferCache,
  files,
  playback,
  resultsList
});
