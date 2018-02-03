import {
  call,
  put
} from 'redux-saga/effects';

import {
  IMPORT_INSERT_ERROR,
  IMPORT_INSERT_START,
  IMPORT_INSERT_SUCCESS
} from '../actions/action-types';
import * as DbService from '../db-service/db-service.js';

export function* createImport(imp) {
  yield put({type: IMPORT_INSERT_START, theImport: imp});
  let result;

  try {
    result = yield call(DbService.createImport, imp);
  } catch (error) {
    yield put({type: IMPORT_INSERT_ERROR});
  }

  if (result) {
    yield put({type: IMPORT_INSERT_SUCCESS, theImport: imp});
  }
}
