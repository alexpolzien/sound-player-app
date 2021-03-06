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
  IMPORT_READY_TO_INSERT,
  LIBRARY_CREATE_NEW,
  LIBRARY_SET_ID,
  LIBRARY_UPDATED,
  LIST_SELECT_FILE_ID,
  PLAYBACK_SET_PLAYING,
  PLAYBACK_SET_STOPPED,
  PLAYBACK_TOGGLE_PLAY,
  SELECT_FILE,
  TAGS_CREATE_NEW,
  TAGS_SELECT_ID,
  TAGS_UPDATED,
  TAGS_UNSELECT_ID
} from '../actions/action-types';
import {SOUNDS_DIR} from '../constants';
import {getBufferData} from '../buffer-cache-service/buffer-cache-service';
import * as ImportSagas from './import-sagas';
import * as LibrarySagas from './library-sagas';
import {sortLibrariesArray} from '../utils/library-utils';
import {loadState} from '../local-storage-service/local-storage-service';
import * as ResultsSagas from './results-sagas';
import {getPlayer, waitForStop} from '../sound-player-service/sound-player-service';
import * as TagSagas from './tag-sagas';

function* initApp(action) {
  const savedState = loadState();
  let libraryId;

  if (savedState) {
    yield put({type: APP_STATE_RECALLED, savedState});
    if (savedState.libraries.selectedId) {
      libraryId = savedState.libraries.selectedId;
    }
  }

  const libraries = yield call(LibrarySagas.fetchLibraries);

  // select a library if there isn't one selected
  if (!libraryId) {
    const libArray = Object.values(libraries);
    sortLibrariesArray(libArray); // TODO: insert default library
    libraryId = libArray[0].id;
    yield put(setLibraryId(libraryId));
  }

  yield call(TagSagas.fetchTags, libraryId);

  // if there is a saved library id, set it TODO: load tags instead?
  /*if (savedState.libraries.selectedId) {
    yield put(setLibraryId(savedState.libraries.selectedId));
  }*/
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

function* fetchTagsWithAction(action) {
  yield call(fetchTags, action.libraryId);
}

function* createImport(action) {
  yield call(ImportSagas.createImport, action.theImport);
}

function* handleLibraryChanges(action) {
  // re-fetch tags if the current library changed
  const selectedLib = yield select(state => state.libraries.selectedId);
  if (selectedLib === action.libraryId) {
    yield call(TagSagas.fetchTags, action.libraryId);
  }
}

function* handleTagChanges(action) {
  console.log('tags changed', action);
  yield call(ResultsSagas.fetchResults, action.libraryId)
}

function* watchCreateLibrary() {
  yield takeEvery(LIBRARY_CREATE_NEW, LibrarySagas.createLibrary);
}

function* watchCreateTag() {
  yield takeEvery(TAGS_CREATE_NEW, TagSagas.createTag);
}

function* watchImportReady() {
  yield takeEvery(IMPORT_READY_TO_INSERT, createImport);
}

function* watchInitApp() {
  yield takeLatest(APP_INIT, initApp);
}

function* watchLibraryChanges() {
  yield takeLatest([LIBRARY_SET_ID, LIBRARY_UPDATED], handleLibraryChanges);
}

function* watchSelectFile() {
  yield takeEvery(SELECT_FILE, selectFile);
}

function* watchStopped() {
  yield takeLatest(PLAYBACK_SET_STOPPED, onStopped);
}

function* watchTagChanges() {
  yield takeLatest(
    [TAGS_SELECT_ID, TAGS_UPDATED, TAGS_UNSELECT_ID], handleTagChanges);
}

function* watchTogglePlay() {
  yield takeLatest(PLAYBACK_TOGGLE_PLAY, togglePlay);
}

export default function* rootSaga() {
  yield all([
    watchCreateLibrary(),
    watchCreateTag(),
    watchImportReady(),
    watchInitApp(),
    watchLibraryChanges(),
    watchSelectFile(),
    watchStopped(),
    watchTagChanges(),
    watchTogglePlay()
  ]);
}
