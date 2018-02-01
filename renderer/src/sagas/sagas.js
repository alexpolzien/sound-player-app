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
  setLibraryId
} from '../actions/actions';
import {
  BUFFER_FETCHED_FROM_CACHE_SUCCESS,
  APP_INIT,
  APP_STATE_RECALLED,
  LIBRARY_CREATE_NEW,
  LIBRARY_SET_ID,
  LIST_SELECT_FILE_ID,
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_PLAY,
  SELECT_FILE,
  TAGS_CREATE_NEW
} from '../actions/action-types';
import {SOUNDS_DIR} from '../constants';
import {getBufferData} from '../buffer-cache-service/buffer-cache-service';
import {nextFileSelector} from '../shared-selectors/file-selectors';
import {doCreateLibrary, fetchLibraries} from './library-sagas';
import {loadState} from '../local-storage-service/local-storage-service';
import {getPlayer, waitForStop} from '../sound-player-service/sound-player-service';
import {doCreateTag, fetchTags} from './tag-sagas';

function* initApp(action) {
  const savedState = loadState();
  if (savedState) {
    yield put({type: APP_STATE_RECALLED, savedState});
  }
  yield call(fetchLibraries);

  // if there is a saved library id, set it TODO: load tags instead?
  if (savedState.libraries.selectedId) {
    yield put(setLibraryId(savedState.libraries.selectedId));
  }
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

function* watchCreateLibrary() {
  yield takeEvery(LIBRARY_CREATE_NEW, doCreateLibrary);
}

function* watchCreateTag() {
  yield takeEvery(TAGS_CREATE_NEW, doCreateTag);
}

function* watchInitApp() {
  yield takeLatest(APP_INIT, initApp);
}

function* watchLibrarySetId() {
  yield takeLatest(LIBRARY_SET_ID, fetchTags);
}

function* watchSelectFile() {
  yield takeEvery(SELECT_FILE, selectFile);
}

function* watchStopped() {
  yield takeLatest(PLAYBACK_SET_STOPPED, onStopped);
}

function* watchTogglePlay() {
  yield takeLatest(PLAYBACK_TOGGLE_PLAY, togglePlay);
}

export default function* rootSaga() {
  yield all([
    watchCreateLibrary(),
    watchCreateTag(),
    watchInitApp(),
    watchLibrarySetId(),
    watchSelectFile(),
    watchStopped(),
    watchTogglePlay()
  ]);
}
