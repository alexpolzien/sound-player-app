import {
  SET_LIBRARY_ID
} from '../actions/action-types';

class LocalStorage {
  constructor() {
    this.ls = null;
  }

  init(windowObj) {
    this.ls = windowObj.localStorage;
  }

  get libraryId() {
    return this.ls.getItem('libraryId');
  }

  set libraryId(value) {
    this.ls.setItem('libraryId', value);
  }
}

const ls = new LocalStorage();

export default ls;

const createLocalStorageMiddleware = () => store => {
  return next => action => {
    switch (action.type) {
      case SET_LIBRARY_ID:
        ls.libraryId = action.id;
        break;
      default:
        break;
    }

    next(action);
  }
}

export const localStorageMiddleware = createLocalStorageMiddleware();
