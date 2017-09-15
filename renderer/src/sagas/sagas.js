import {delay} from 'redux-saga';
import {all, call, put, takeLatest} from 'redux-saga/effects';

import {
  LOAD_FILES,
  LOAD_FILES_FAIL,
  LOAD_FILES_START,
  LOAD_FILES_SUCCESS
} from '../actions/action-types';
import {getFiles} from '../files-service/files-service';

function* loadFiles() {
  yield put({type: LOAD_FILES_START});
  try {
    const result = yield call(getFiles);
    yield put({type: LOAD_FILES_SUCCESS, files: result});
  } catch (e) {
    yield put({type: LOAD_FILES_FAIL, message: e.message});
  }

}

function* watchLoadFiles() {
  yield takeLatest(LOAD_FILES, loadFiles);
}

export default function* rootSaga() {
  yield all([
    watchLoadFiles()
  ]);
}
