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

function getTimestamp() {
  return (new Date()).getTime();
}

export function initDb(windowObj) {
  const request = windowObj.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.onupgradeneeded = (e) => {
    // create db here
    const database = e.target.result;

    const librariesStore = database.createObjectStore('libraries', {autoIncrement: true});
    librariesStore.createIndex('name', 'name', {unique: true});

    const importsStore = database.createObjectStore('imports', {keyPath: 'id'});
    importsStore.createIndex('libraryId', 'libraryId', {unique: false});

    const tagsStore = database.createObjectStore('tags', {autoIncrement: true});
    tagsStore.createIndex('libraryId', 'libraryId', {unique: false});

    // test db items
    tagsStore.transaction.oncomplete = (e) => {
      const trans = database.transaction(['libraries', 'tags'], 'readwrite');

      const timeStamp = (new Date()).getTime();
      const libStore = trans.objectStore('libraries');

      libStore.add({name: 'Test Library #1', timeCreated: timeStamp});
      libStore.add({name: 'Test Library #2', timeCreated: timeStamp});

      const tagsStore = trans.objectStore('tags');

      for (let i = 1; i <=2; i++) {
        for (let j = 1; j <= 10; j++) {
          const name = `Tag #${j}`;
          const timeCreated = (new Date()).getTime();
          const tag = {
            name,
            timeCreated,
            libraryId: i
          }
          tagsStore.add(tag);
        }
      }
    }
  }

  request.onsuccess = (e) => {
    const database = e.target.result;
    _dbPromiseResolver(database);
  }

  request.onerror = (e) => {
    console.log('db error', e.target.error);
  }
}

export function createLibrary(name) {
  return db.then(db => new Promise(
    (resolve, reject) => {
      const store = db.transaction('libraries', 'readwrite').objectStore('libraries');
      const request = store.add({name, timeCreated: getTimestamp()});
      request.onsuccess = resolve;
      request.onerror = handleError(reject);
    }
  ));
}

export function createTag(name, libraryId) {
  return db.then(db => new Promise(
    (resolve, reject) => {
      const store = db.transaction('tags', 'readwrite').objectStore('tags');
      const request = store.add({
        name,
        libraryId,
        timeCreated: getTimestamp()
      });
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
            libraries[cursor.primaryKey] = {
              ...cursor.value,
              id: cursor.primaryKey
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

export function getTags(libraryId) {
  return db.then(
    db => new Promise(
      (resolve, reject) => {
        const store = db.transaction('tags').objectStore('tags');
        const index = store.index('libraryId');
        const bound = IDBKeyRange.bound(libraryId, libraryId, false, false);

        const tags = {};
        const request = index.openCursor(bound);
        request.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            tags[cursor.primaryKey] = {
              ...cursor.value,
              id: cursor.primaryKey
            }
            cursor.continue();
          } else {
            resolve(tags);
          }
        }

        request.onerror = handleError(reject);
      }
    )
  );
}
