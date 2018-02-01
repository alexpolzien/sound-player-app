import {
  call,
  put
} from 'redux-saga/effects';

import {
  TAGS_CREATE_NEW_ERROR,
  TAGS_FETCH_ERROR,
  TAGS_FETCH_START,
  TAGS_FETCH_SUCCESS
} from '../actions/action-types';
import {
  createTag,
  getTags
} from '../db-service/db-service';

export function* doCreateTag(action) {
  let result;
  try {
    result = yield call(createTag, action.name, action.libraryId);
  } catch (error) {
    yield put({
      type: TAGS_CREATE_NEW_ERROR,
      error,
      name: action.name
    });
  }

  if (result) {
    yield call(fetchTags, {id: action.libraryId});
  }
}

export function* fetchTags(action) {
  const libraryId = action.id;
  yield put({type: TAGS_FETCH_START});

  let tags;
  try {
    tags = yield call(getTags, libraryId);
  } catch (error) {
    yield put({type: TAGS_FETCH_ERROR});
  }

  if (tags) {
    yield put({
      type: TAGS_FETCH_SUCCESS,
      tags,
      libraryId
    });
  }
}
