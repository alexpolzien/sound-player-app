import {
  LIBRARY_SET_ID,
  SET_PANEL_OFF,
  SET_PANEL_ON,
  TOGGLE_PANEL
} from '../actions/action-types';
import {SAVED_STATE_SCHEMA_VERSION} from '../constants';
import {customError} from '../utils/error-utils';

let ls = null;

function saveState(store) {
  const state = store.getState();
  const savedState = {
    _version: SAVED_STATE_SCHEMA_VERSION,
    activePanels: {
      ...state.activePanels
    },
    libraries: {
      selectedId: state.libraries.selectedId
    }
  };
  localStorage.savedState = JSON.stringify(savedState);
}

export function loadState() {
  let state;
  try {
    state = JSON.parse(localStorage.savedState);
  } catch (err) {
    return null;
  }
  if (state._version !== SAVED_STATE_SCHEMA_VERSION) {
    return null;
  }

  return state;
}

export function initLocalStorage(windowObj) {
  ls = windowObj.localStorage;
}

const createLocalStorageMiddleware = () => store => {
  return next => action => {
    next(action);

    switch (action.type) {
      case LIBRARY_SET_ID:
      case SET_PANEL_OFF:
      case SET_PANEL_ON:
      case TOGGLE_PANEL:
        saveState(store);
        break;
      default:
        break;
    }
  }
}

export const localStorageMiddleware = createLocalStorageMiddleware();
