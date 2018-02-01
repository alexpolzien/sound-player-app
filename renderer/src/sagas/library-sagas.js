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
import {
  createLibrary,
  getLibraries
} from '../db-service/db-service-2';

export function* doCreateLibrary(action) {
  let result;
  try {
    result = yield call(createLibrary, action.name);
  } catch (error) {
    yield put({
      type: LIBRARY_CREATE_NEW_ERROR,
      error,
      name: action.name
    });
  }

  if (result) {
    yield call(fetchLibraries);
  }
}

export function* fetchLibraries() {
  yield put({type: LIBRARIES_FETCH_ALL_START});

  let libraries;
  try {
    libraries = yield call(getLibraries);
  } catch (error) {
    yield put({type: LIBRARIES_FETCH_ALL_ERROR, error});
  }
  if (libraries) {
    yield put({
      type: LIBRARIES_FETCH_ALL_SUCCESS,
      libraries
    });
  }
}
