import {remote} from 'electron';
const fs = remote.require('fs');
import {
  all,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import {
  IMPORT_BUFFER_READ,
  IMPORT_BUFFER_READ_ERROR,
  IMPORT_CREATE_NEW,
  IMPORT_ONE_PATH,
  IMPORT_PATHS
} from '../actions/action-types';
import {ALLOWED_FILE_EXTENSIONS} from '../constants';
import {decoderPool} from '../decode-service/decode-service';
import {
  flattenPaths,
  filterExtensions
} from '../utils/fs-utils';

function* createNew(action) {
  let {files, errors} = yield call(flattenPaths, action.filePaths);
  files = filterExtensions(files, ALLOWED_FILE_EXTENSIONS);
  yield put({
    type: IMPORT_PATHS,
    id: action.id,
    filePaths: files
  });

  // yield actions to import each file
  for (const filePath of files) {
    yield put({
      type: IMPORT_ONE_PATH,
      importId: action.id,
      filePath
    });
  }
}

function* watchCreateNew() {
  yield takeEvery(IMPORT_CREATE_NEW, createNew)
}

function readFile(filePath) {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          resolve({error: err});
        } else {
          resolve({data: data});
        }
      });
    }
  );
}

function* readOneFile(action) {
  const result = yield call(readFile, action.filePath);

  if (result.error) {
    yield put({
      type: IMPORT_BUFFER_READ_ERROR,
      importId: action.importId,
      filePath: action.filePath
    });
  } else {
    yield put({
      type: IMPORT_BUFFER_READ,
      importId: action.importId,
      filePath: action.filePath,
      buffer: result.data
    });
  }
}

function* watchImportOne() {
  yield takeEvery(IMPORT_ONE_PATH, readOneFile);
}

/*function* processBuffer(action) {
  decoderPool.requestJob({
    jobType: 'metadata',
    buffer: action.buffer,
    filePath: action.filePath,
    importId: action.importId
  });
}

function* watchBufferRead() {
  yield takeEvery(IMPORT_BUFFER_READ, processBuffer);
}*/

export default function* rootImportsSaga() {
  yield all([
    watchCreateNew(),
    watchImportOne()
  ]);
}
