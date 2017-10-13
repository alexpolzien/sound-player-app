import {delay} from 'redux-saga';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import {
  DB_LOAD_INITIAL_RESULTS,
  DB_LOAD_INITIAL_RESULTS_FAIL,
  DB_LOAD_INITIAL_RESULTS_START,
  DB_LOAD_INITIAL_RESULTS_SUCCESS,
  LOAD_FILES,
  LOAD_FILES_FAIL,
  LOAD_FILES_START,
  LOAD_FILES_SUCCESS,
  SELECT_FILE,
  DECODE_FILE_SUCCESS,
  DECODE_FILE_FAIL
} from '../actions/action-types';
import {getInitialResults} from '../db-service/db-service';
import {decodeFile} from '../decode-service/decode-service';
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

function* decodeSelectedFile(action) {
  const file = action.file;

  try {
    const result = yield call(decodeFile, file.name);
    yield put({
      type: DECODE_FILE_SUCCESS,
      file: file,
      data: result
    });
  } catch (e) {
    yield put({type: DECODE_FILE_FAIL, file: file});
  }
}

function* watchSelectFile() {
  yield takeEvery(SELECT_FILE, decodeSelectedFile);
}

function* dbLoadInitialResults() {
  yield put({type: DB_LOAD_INITIAL_RESULTS_START});
  try {
    const results = yield call(getInitialResults);
    yield put({
      type: DB_LOAD_INITIAL_RESULTS_SUCCESS,
      results
    });
  } catch (e) {
    yield put({type: DB_LOAD_INITIAL_RESULTS_FAIL, message: e.message});
  }
}

function* watchDbLoadInitialResults() {
  yield takeLatest(DB_LOAD_INITIAL_RESULTS, dbLoadInitialResults);
}

export default function* rootSaga() {
  yield all([
    watchDbLoadInitialResults(),
    watchLoadFiles(),
    watchSelectFile()
  ]);
}
