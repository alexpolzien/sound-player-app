import {combineReducers} from 'redux';

import count from './count';
import files from './files';

export default combineReducers({
  count,
  files
});
