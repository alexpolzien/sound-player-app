import {delay} from 'redux-saga';
import {all, put, takeLatest} from 'redux-saga/effects';

import {LOAD_FILES, LOAD_FILES_SUCCESS} from '../actions/action-types';

function* loadFiles() {
  yield delay(2000);
  yield put({type: LOAD_FILES_SUCCESS, files: ['foo', 'bar']});
}

function* watchLoadFiles() {
  yield takeLatest(LOAD_FILES, loadFiles);
}

export default function* rootSaga() {
  yield all([
    watchLoadFiles()
  ]);
}
