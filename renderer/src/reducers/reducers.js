import {combineReducers} from 'redux';

import bufferCache from './buffer-cache';
import files from './files';

export default combineReducers({
  bufferCache,
  files
});
