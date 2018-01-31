import {ipcRenderer} from 'electron';

import {
  IMPORT_BUFFER_READ,
  IMPORT_CREATE_NEW,
  IMPORT_READ_STATS
} from '../actions/action-types';

const createIpcMiddleware = () => store => {
  ipcRenderer.on('import-read-file-data', (event, importId, filePath, data) => {
    store.dispatch({
      type: IMPORT_BUFFER_READ,
      buffer: data,
      filePath,
      importId
    })
  });

  ipcRenderer.on('import-read-files-stats', (event, importId, files, errors) => {
    store.dispatch({
      type: IMPORT_READ_STATS,
      importId,
      files,
      errors
    });
  });

  return next => action => {
    next(action);

    if (action.type === IMPORT_CREATE_NEW) {
      const importId = action.id;
      const filePaths = action.filePaths;
      ipcRenderer.send('read-import-files', importId, filePaths);
    }
  }
}

export const ipcMiddleware = createIpcMiddleware();
