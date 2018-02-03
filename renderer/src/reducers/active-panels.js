import {
  APP_STATE_RECALLED,
  SET_PANEL_OFF,
  SET_PANEL_ON,
  TOGGLE_PANEL
} from '../actions/action-types';

const initialState = {
  libraries: true,
  tags: false,
  fileTags: false
};

export default function activePanels(state = initialState, action) {
  switch (action.type) {
    case APP_STATE_RECALLED:
      return {
        ...action.savedState.activePanels
      };
    case SET_PANEL_OFF:
      return {
        ...state,
        [action.name]: false
      };
    case SET_PANEL_ON:
      return {
        ...state,
        [action.name]: true
      };
    case TOGGLE_PANEL:
      return {
        ...state,
        [action.name]: !state[action.name]
      };
    default:
      return state;
  }
}
