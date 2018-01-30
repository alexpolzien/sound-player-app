
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
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_PLAY,
  SELECT_FILE
} from '../actions/action-types';
import {SOUNDS_DIR} from '../constants';
import {getBufferData} from '../buffer-cache-service/buffer-cache-service';
import {getInitialResults} from '../db-service/db-service';
import {nextFileSelector} from '../shared-selectors/file-selectors';
import {getPlayer, waitForStop} from '../sound-player-service/sound-player-service';

function* selectFile(action) {
  const file = action.file;
  // update selected file in UI
  yield put({
    type: LIST_SELECT_FILE_ID,
    id: action.file.id,
    newRange: action.newRange,
    addToRange: action.addToRange
  });

  // stop playback
  const player = getPlayer();
  if (player.isPlaying) {
    player.stop();
  }

  // TODO: clear the old buffer?

  // get the file buffer
  const buffer = yield call(getBufferData, file.path);
  // TODO handle failure
  yield put({
    type: BUFFER_FETCHED_FROM_CACHE_SUCCESS,
    file,
    buffer
  });

  const autoPlayOn = yield select(state => state.playback.autoPlay);
  if (autoPlayOn) {
    if (player.isPlaying) {
      yield call(waitForStop);
    }

    player.playFromBuffer(buffer, file);
    yield put({type: PLAYBACK_SET_PLAYING});
  }
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

function selectedFileSelector(state) {
  const resultsList = state.resultsList;
  if (resultsList.selectedId === null) {
    return null;
  }
  return resultsList.files[resultsList.selectedId];
}

function* togglePlay() {
  const player = getPlayer();

  if (player.isPlaying) {
    player.stop();
  } else {
    const file = yield select(selectedFileSelector);
    const buffer = yield call(getBufferData, file.path);

    player.playFromBuffer(buffer, file);
    yield put({type: PLAYBACK_SET_PLAYING});
  }
}

function* watchTogglePlay() {
  yield takeLatest(PLAYBACK_TOGGLE_PLAY, togglePlay);
}

function cyclePlaySelector(state) {
  return state.playback.cyclePlay;
}

function* onStopped() {
  const cyclePlay = yield select(cyclePlaySelector);
  if (cyclePlay) {
    yield waitForStop();
    const nextFile = yield select(nextFileSelector);
    yield put({type: SELECT_FILE, file: nextFile});
  }
}

function* watchStopped() {
  yield takeLatest(PLAYBACK_SET_STOPPED, onStopped);
}

export default function* rootSaga() {
  yield all([
    watchDbLoadInitialResults(),
    watchSelectFile(),
    watchStopped(),
    watchTogglePlay()
  ]);
}
