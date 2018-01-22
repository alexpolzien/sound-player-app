import {
  IMPORT_CREATE_NEW,
  IMPORT_PATHS
} from '../actions/action-types';

const initialState = {
  activeImports: {}
};

export default function imports(state = initialState, action) {
  switch (action.type) {
    case IMPORT_CREATE_NEW:
      return {
        ...state,
        activeImports: {
          ...state.activeImports,
          [action.id]: {}
        }
      };
    case IMPORT_PATHS:
      if (!(action.id in state.activeImports)) {
        throw new Error(`Bad import id ${action.id}`);
      } else {
        return {
          ...state,
          activeImports: {
            ...state.activeImports,
            [action.id]: {
              ...state.activeImports[action.id],
              filePaths: action.filePaths
            }
          }
        };
      }
    default:
      return state;
  }
}
