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
  BUFFER_FETCHED_FROM_CACHE_SUCCESS,
  DB_LOAD_INITIAL_RESULTS,
  DB_LOAD_INITIAL_RESULTS_FAIL,
  DB_LOAD_INITIAL_RESULTS_START,
  DB_LOAD_INITIAL_RESULTS_SUCCESS,
  LIST_SELECT_FILE_ID,
  SELECT_FILE
} from '../actions/action-types';
import {SOUNDS_DIR} from '../constants';
import {getBufferData} from '../buffer-cache-service/buffer-cache-service';
import {getInitialResults} from '../db-service/db-service';

function* selectFile(action) {
  const file = action.file;
  // update selected file in UI
  yield put({
    type: LIST_SELECT_FILE_ID,
    id: file.id
  });

  // TODO: clear the old buffer?

  // get the file buffer
  const buffer = yield call(getBufferData, file.path);
  // TODO handle failure
  yield put({
    type: BUFFER_FETCHED_FROM_CACHE_SUCCESS,
    file,
    buffer
  });
}

function* watchSelectFile() {
  yield takeEvery(SELECT_FILE, selectFile);
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
    watchSelectFile()
  ]);
}
