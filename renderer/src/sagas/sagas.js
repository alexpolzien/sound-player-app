import {delay} from 'redux-saga';
import {
  all,
  call,
  put,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import {
  LOAD_FILES,
  LOAD_FILES_FAIL,
  LOAD_FILES_START,
  LOAD_FILES_SUCCESS,
  SELECT_FILE,
  DECODE_FILE_SUCCESS,
  DECODE_FILE_FAIL
} from '../actions/action-types';
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
  try {
    const result = yield call(decodeFile, action.filename);
    console.log(result);
    yield put({type: DECODE_FILE_SUCCESS, filename: action.filename});
  } catch (e) {
    yield put({type: DECODE_FILE_FAIL, filename: action.filename});
  }
}

function* watchSelectFile() {
  yield takeEvery(SELECT_FILE, decodeSelectedFile);
}

export default function* rootSaga() {
  yield all([
    watchLoadFiles(),
    watchSelectFile()
  ]);
}
