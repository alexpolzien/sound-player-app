import {
  call,
  put
} from 'redux-saga/effects';

import {
  LIBRARY_CREATE_NEW_ERROR,
  LIBRARIES_FETCH_ALL_ERROR,
  LIBRARIES_FETCH_ALL_SUCCESS,
  LIBRARIES_FETCH_ALL_START
} from '../actions/action-types';
import * as DbService from '../db-service/db-service';

export function* createLibrary(action) {
  let result;
  try {
    result = yield call(DbService.createLibrary, action.name);
  } catch (error) {
    yield put({
      type: LIBRARY_CREATE_NEW_ERROR,
      error,
      name: action.name
    });
  }

  if (result) {
    yield call(DbService.fetchLibraries);
  }
}

export function* fetchLibraries() {
  yield put({type: LIBRARIES_FETCH_ALL_START});

  let libraries;
  try {
    libraries = yield call(DbService.getLibraries);
  } catch (error) {
    yield put({type: LIBRARIES_FETCH_ALL_ERROR, error});
  }
  if (libraries) {
    yield put({
      type: LIBRARIES_FETCH_ALL_SUCCESS,
      libraries
    });
  }
  return libraries;
}
