import {INCREMENT_COUNT} from '../actions/action-types';

export default function count(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNT:
      return state + 1;
    default:
      return state;
  }
}
