import {combineReducers} from 'redux';

import files from './files';
import playback from './playback';
import resultsList from './results-list';

export default combineReducers({
  files,
  playback,
  resultsList
});
