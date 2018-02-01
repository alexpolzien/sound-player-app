import {delay} from 'redux-saga';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
const {remote} = require('electron');
const {Menu, MenuItem} = remote;

import {
  BUFFER_FETCHED_FROM_CACHE_SUCCESS,
  INIT_APP,
  LIBRARY_CREATE_NEW,
  LIBRARIES_FETCH_ALL_ERROR,
  LIBRARIES_FETCH_ALL_SUCCESS,
  LIBRARIES_FETCH_ALL_START,
  LIST_SELECT_FILE_ID,
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_PLAY,
  SELECT_FILE
} from '../actions/action-types';
import {SOUNDS_DIR} from '../constants';
import {getBufferData} from '../buffer-cache-service/buffer-cache-service';
import {getInitialResults} from '../db-service/db-service';
import {
  createLibrary,
  getLibraries
} from '../db-service/db-service-2';
import {nextFileSelector} from '../shared-selectors/file-selectors';
import ls from '../local-storage-service/local-storage-service';
import {getPlayer, waitForStop} from '../sound-player-service/sound-player-service';

function* initApp(action) {
  const libraryId = ls.libraryId;
  yield put({type: LIBRARIES_FETCH_ALL_START});

  let libraries;
  try {
    libraries = yield call(getLibraries);
  } catch (err) {
    // TODO: error
  }
  if (libraries) {
    yield put({
      type: LIBRARIES_FETCH_ALL_SUCCESS,
      libraries
    });
  }
}

function* watchInitApp() {
  yield takeLatest(INIT_APP, initApp);
}

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

function* fetchLibraries() {

}

function* doCreateLibrary(action) {
  let result;
  try {
    result = yield call(createLibrary, action.name);
  } catch (error) {
    console.log(error); // TODO: handle constraint error
  }

  if (result) {
    const libraries = yield call(getLibraries);
    yield put({
      type: LIBRARIES_UPDATED,
      libraries
    });
  }
}

function* watchCreateLibrary() {
  yield takeEvery(LIBRARY_CREATE_NEW, doCreateLibrary);
}

export default function* rootSaga() {
  yield all([
    watchCreateLibrary(),
    watchInitApp(),
    watchSelectFile(),
    watchStopped(),
    watchTogglePlay()
  ]);
}
