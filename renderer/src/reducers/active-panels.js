import {
  SET_PANEL_OFF,
  SET_PANEL_ON,
  TOGGLE_PANEL
} from '../actions/action-types';

const initialState = {
  libraries: false,
  tags: false,
  info: false
};

export default function activePanels(state = initialState, action) {
  switch (action.type) {
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
