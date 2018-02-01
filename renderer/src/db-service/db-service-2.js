import {
  DATABASE_NAME,
  DATABASE_VERSION
} from '../constants';

let _dbPromiseResolver;
let _dbPromiseRejecter;

const db = new Promise(
  (resolve, reject) => {
    _dbPromiseResolver = resolve;
    _dbPromiseRejecter = reject;
  }
);

function handleError(reject) {
  // takes a resolve function and returns a function that rejects with the db error

  return (e) => {
    reject(e.target.error);
  }
}

export function initDb(windowObj) {
  const request = windowObj.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.onupgradeneeded = (e) => {
    // create db here
    const database = e.target.result;

    const librariesStore = database.createObjectStore('libraries', {autoIncrement: true});
    librariesStore.createIndex('name', 'name', {unique: true});

    // test library
    librariesStore.transaction.oncomplete = (e) => {
      const store = database.transaction('libraries', 'readwrite').objectStore('libraries');
      store.add({name: 'test library 1'});
      store.add({name: 'test library 2'});
    }

    const importsStore = database.createObjectStore('imports', {keyPath: 'id'});
    importsStore.createIndex('libraryId', 'libraryId', {unique: false});
  }

  request.onsuccess = (e) => {
    const database = e.target.result;
    _dbPromiseResolver(database);
  }

  request.onerror = (e) => {
    // TODO
  }
}

export function createLibrary(name) {
  return db.then(db => new Promise(
    (resolve, reject) => {
      const store = db.transaction('libraries', 'readwrite').objectStore('libraries');
      const request = store.add({name});
      request.onsuccess = resolve;
      request.onerror = handleError(reject);
    }
  ));
}

export function getLibraries() {
  return db.then(
    db => new Promise(
      (resolve, reject) => {
        const store = db.transaction('libraries').objectStore('libraries');

        const libraries = {};
        store.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            libraries[cursor.key] = {
              ...cursor.value,
              id: cursor.key
            };
            cursor.continue();
          } else {
            resolve(libraries);
          }
        }
      }
    )
  );
}
