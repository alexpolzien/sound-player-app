import {
  all,
  call,
  takeEvery
} from 'redux-saga/effects';

import {flattenPaths} from '../utils/fs-utils';

import {
  IMPORT_CREATE_NEW
} from '../actions/action-types';

function* createNew(action) {
  console.log('createNew', action);
  const paths = yield call(flattenPaths, action.filePaths);
  console.log(paths);
}

function* watchCreateNew() {
  yield takeEvery(IMPORT_CREATE_NEW, createNew)
}

export default function* rootImportsSaga() {
  yield all([
    watchCreateNew()
  ]);
}
