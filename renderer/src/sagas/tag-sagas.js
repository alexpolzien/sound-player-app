import {
  call,
  put
} from 'redux-saga/effects';

import {
  LIBRARY_UPDATED,
  TAGS_CREATE_NEW_ERROR,
  TAGS_FETCH_ERROR,
  TAGS_FETCH_START,
  TAGS_FETCH_SUCCESS,
  TAGS_UPDATED
} from '../actions/action-types';
import * as DbService from '../db-service/db-service';

export function* createTag(action) {
  let result;
  try {
    result = yield call(DbService.createTag, action.name, action.libraryId);
  } catch (error) {
    yield put({
      type: TAGS_CREATE_NEW_ERROR,
      error,
      name: action.name
    });
  }

  if (result) {
    yield put({type: LIBRARY_UPDATED, libraryId: action.libraryId});
  }
}

export function* fetchTags(libraryId) {
  yield put({type: TAGS_FETCH_START});

  let tags;
  try {
    tags = yield call(DbService.getTags, libraryId);
  } catch (error) {
    yield put({type: TAGS_FETCH_ERROR, error});
  }

  if (tags) {
    yield put({
      type: TAGS_FETCH_SUCCESS,
      tags,
      libraryId
    });

    yield put({type: TAGS_UPDATED, libraryId});
  }

  return tags;
}
