import {
  IMPORT_METADATA_DECODED,
  IMPORT_READY_TO_INSERT,
  IMPORT_REMOVE_IMPORT
} from '../actions/action-types';

function allFilesComplete(theImport) {
  // return true if all files have completed decoding
  for (const path in theImport.files) {
    if (theImport.files[path].status === 'decoding') {
      return false;
    }
  }
  return true;
}

const createImporterMiddleware = () => store => {

  return next => action => {
    next(action); // let importer reducers run first
    if (action.type === IMPORT_METADATA_DECODED) {
      const importId = action.importId;
      const state = store.getState();
      const currentImport = state.imports.activeImports[importId];
      if (allFilesComplete(currentImport)) {
        store.dispatch({
          type: IMPORT_READY_TO_INSERT,
          theImport: currentImport
        });
      }
    }
  }
};

export const importerMiddleware = createImporterMiddleware();
