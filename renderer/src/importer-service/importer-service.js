import {
  IMPORT_METADATA_DECODED,
  IMPORT_METADATA_DECODED_BATCH,
  IMPORT_READY_TO_INSERT,
  IMPORT_REMOVE_IMPORT
} from '../actions/action-types';
import {copyWithoutEntries} from '../utils/object-utils';

function allFilesComplete(theImport) {
  // return true if all files have completed decoding
  for (const path in theImport.files) {
    const status = theImport.files[path].status;
    if (status !== 'error' && status !== 'decoded') {
      return false;
    }
  }
  return true;
}

const createImporterMiddleware = () => store => {
  let batches = {};
  let batchTimer = null;
  const batchTimeout = 500;

  return next => action => {
    next(action); // let importer reducers run first
    if (action.type === IMPORT_METADATA_DECODED_BATCH) {
      const importId = action.importId;
      const state = store.getState();
      const currentImport = state.imports.activeImports[importId];
      if (allFilesComplete(currentImport)) {
        store.dispatch({
          type: IMPORT_READY_TO_INSERT,
          theImport: currentImport
        });
      }
    } else if (action.type === IMPORT_METADATA_DECODED) {
      const importId = action.importId;
      if (!(importId in batches)) {
        batches[importId] = [];
      }
      batches[importId].push(copyWithoutEntries(action, 'type'));

      if (batchTimer === null) {
        setTimeout(() => {
          for (const importId in batches) {
            store.dispatch({
              type: IMPORT_METADATA_DECODED_BATCH,
              importId,
              metadatas: batches[importId]
            });
          }
          batches = {};
          batchTimer = null;
        }, batchTimeout);
      }
    }
  }
};

export const importerMiddleware = createImporterMiddleware();
