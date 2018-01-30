import {
  IMPORT_CREATE_NEW,
  IMPORT_METADATA_DECODED,
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
          [action.id]: {
            id: action.id,
            timeCreated: action.timeCreated,
            files: {}
          }
        }
      };
    case IMPORT_PATHS:
      if (!(action.id in state.activeImports)) {
        throw new Error(`Bad import id ${action.id}`);
      } else {
        const files = {};
        for (const path of action.filePaths) {
          files[path] = {status: 'decoding'};
        }
        return {
          ...state,
          activeImports: {
            ...state.activeImports,
            [action.id]: {
              ...state.activeImports[action.id],
              files
            }
          }
        };
      }
    case IMPORT_METADATA_DECODED:
      const importId = action.importId;
      if (!(importId in state.activeImports)) {
        throw new Error(`Bad import id ${importId}`);
      }
      const oldImport = state.activeImports[importId];
      const oldFile = oldImport.files[action.filePath];
      const newFile = {
        ...oldFile,
        status: 'decoded',
        bitDepth: action.bitDepth,
        channels: action.channels,
        durationMs: action.durationMs,
        sampleRate: action.sampleRate
      };
      const newImport = {
        ...oldImport,
        files: {
          ...oldImport.files,
          [action.filePath]: newFile
        }
      };
      return {
        ...state,
        activeImports: {
          ...state.activeImports,
          [importId]: newImport
        }
      };
    default:
      return state;
  }
}
