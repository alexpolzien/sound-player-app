import {
  IMPORT_CREATE_NEW,
  LIBRARY_CREATE_NEW,
  LIBRARY_SET_ID,
  PLAYBACK_SET_VOLUME,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_CYCLE_PLAY,
  PLAYBACK_TOGGLE_PLAY,
  RESULTS_SET_SORT_DIRECTION,
  RESULTS_SET_SORT_TYPE,
  SET_PANEL_OFF,
  SET_PANEL_ON,
  SELECT_FILE,
  TAGS_CREATE_NEW,
  TAGS_SELECT_ID,
  TAGS_UNSELECT_ID,
  TOGGLE_PANEL
} from './action-types';
import {getUniqueId} from '../utils/id-utils';

export function selectFile(file, newRange, addToRange) {
  return {
    type: SELECT_FILE,
    file,
    newRange,
    addToRange
  };
}

export function toggleAutoPlay() {
  return {type: PLAYBACK_TOGGLE_AUTO_PLAY};
}

export function toggleCyclePlay() {
  return {type: PLAYBACK_TOGGLE_CYCLE_PLAY};
}

export function togglePlayback() {
  return {type: PLAYBACK_TOGGLE_PLAY};
}

export function setResultsSortType(sortType) {
  return {
    type: RESULTS_SET_SORT_TYPE,
    sortType
  };
}

export function setResultsSortDirection(direction) {
  return {
    type: RESULTS_SET_SORT_DIRECTION,
    direction
  };
}

export function createNewImport(filePaths, libraryId) {
  return {
    type: IMPORT_CREATE_NEW,
    id: getUniqueId(),
    libraryId,
    filePaths
  };
}

export function setPanelOn(name) {
  return {
    type: SET_PANEL_ON,
    name
  };
}

export function setPanelOff(name) {
  return {
    type: SET_PANEL_OFF,
    name
  };
}

export function togglePanel(name) {
  return {
    type: TOGGLE_PANEL,
    name
  };
}

export function setLibraryId(id) {
  return {
    type: LIBRARY_SET_ID,
    id
  };
}

export function createLibrary(name) {
  return {
    type: LIBRARY_CREATE_NEW,
    name
  };
}

export function selectTag(id) {
  return {
    type: TAGS_SELECT_ID,
    id
  };
}

export function unselectTag(id) {
  return {
    type: TAGS_UNSELECT_ID,
    id
  };
}

export function createTag(name, libraryId) {
  return {
    type: TAGS_CREATE_NEW,
    name,
    libraryId
  }
}
