import {
  call,
  put
} from 'redux-saga/effects';

import {
  RESULTS_FETCH_ERROR,
  RESULTS_FETCH_START,
  RESULTS_FETCH_SUCCESS
} from '../actions/action-types';
import * as DbService from '../db-service/db-service';

export function* fetchResults(libraryId) {
  yield put({type: RESULTS_FETCH_START});

  let files;
  try {
    files = yield call(DbService.getAllFiles, libraryId);
  } catch (error) {
    console.log(error);
    yield put({type: RESULTS_FETCH_ERROR, error})
  }

  if (files) {
    yield put({type: RESULTS_FETCH_SUCCESS, files});
  }
}
