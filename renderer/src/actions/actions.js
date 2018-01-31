import {
  IMPORT_CREATE_NEW,
  PLAYBACK_SET_VOLUME,
  PLAYBACK_TOGGLE_AUTO_PLAY,
  PLAYBACK_TOGGLE_CYCLE_PLAY,
  PLAYBACK_TOGGLE_PLAY,
  RESULTS_SET_SORT_DIRECTION,
  RESULTS_SET_SORT_TYPE,
  SET_PANEL_OFF,
  SET_PANEL_ON,
  SELECT_FILE,
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

export function createNewImport(filePaths) {
  return {
    type: IMPORT_CREATE_NEW,
    id: getUniqueId(),
    timeCreated: (new Date()).getTime(),
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
