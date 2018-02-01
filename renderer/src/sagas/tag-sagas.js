import {
  call,
  put
} from 'redux-saga/effects';

import {
  TAGS_FETCH_ERROR,
  TAGS_FETCH_START,
  TAGS_FETCH_SUCCESS
} from '../actions/action-types';
import {
  getTags
} from '../db-service/db-service';


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
