import {INCREMENT_COUNT} from './action-types';

const initialState = {count: 0};

export function testReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1
      }
    default:
      return state;
  }

  return state;
}
