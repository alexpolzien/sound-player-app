import {
  all,
  call,
  takeEvery
} from 'redux-saga/effects';

import {ALLOWED_FILE_EXTENSIONS} from '../constants';
import {
  flattenPaths,
  filterExtensions
} from '../utils/fs-utils';

import {
  IMPORT_CREATE_NEW
} from '../actions/action-types';

function* createNew(action) {
  console.log('createNew', action);
  let {files, errors} = yield call(flattenPaths, action.filePaths);
  files = filterExtensions(files, ALLOWED_FILE_EXTENSIONS);
  console.log(files);
}

function* watchCreateNew() {
  yield takeEvery(IMPORT_CREATE_NEW, createNew)
}

export default function* rootImportsSaga() {
  yield all([
    watchCreateNew()
  ]);
}
