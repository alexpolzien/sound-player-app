import {
  IMPORT_CREATE_NEW,
  IMPORT_INSERT_SUCCESS,
  IMPORT_METADATA_DECODED,
  IMPORT_READ_STATS,
  IMPORT_REMOVE_IMPORT
} from '../actions/action-types';
import {copyWithoutEntries} from '../utils/object-utils';

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
            files: {},
            libraryId: action.libraryId
          }
        }
      };
    case IMPORT_INSERT_SUCCESS:
      const activeImports = {...state.activeImports};
      delete activeImports[action.theImport.id];
      return {
        ...state,
        activeImports
      };
    case IMPORT_READ_STATS:
      {
        const importId = action.importId;
        if (!(importId in state.activeImports)) {
          throw new Error(`Bad import id ${importId}`);
        } else {
          const files = {...state.activeImports[importId].files};
          for (const filePath of action.files) {
            if (!(filePath in files)) {
              files[filePath] = {status: 'reading'};
            }
          }

          for (const filePath of action.errors) {
            if (!(filePath in files)) {
              files[filePath] = {status: 'error'};
            }
          }

          return {
            ...state,
            activeImports: {
              ...state.activeImports,
              [importId]: {
                ...state.activeImports[importId],
                files
              }
            }
          };
        }
      }
    case IMPORT_METADATA_DECODED:
      {
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
      }
    case IMPORT_REMOVE_IMPORT:
      return {
        ...state,
        activeImports: copyWithoutEntries(state.activeImports, action.id)
      };
    default:
      return state;
  }
}
