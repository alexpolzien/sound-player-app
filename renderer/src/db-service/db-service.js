import {
  DATABASE_NAME,
  DATABASE_VERSION
} from '../constants';
import {customError} from '../utils/error-utils';

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
    console.log(e);
    reject(e.target.error);
  }
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = resolve;
    request.onerror = reject;
  });
}

function getTimestamp() {
  return (new Date()).getTime();
}

function sanitizeName(str) {
  // remove leading and trailing whitespace
  return str.replace(/^\s+|\s+$/g, '');
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
    tagsStore.createIndex('libraryId-name', ['libraryId', 'name'], {unique: true});

    const filesStore = database.createObjectStore('files', {autoIncrement: true});
    filesStore.createIndex('importId', 'importId', {unique: false});
    filesStore.createIndex('libraryId', 'libraryId', {unique: false});
    filesStore.createIndex('path-libraryId', ['path', 'libraryId'], {unique: true});

    const fileTagsStore = database.createObjectStore('fileTags', {autoIncrement: true});
    fileTagsStore.createIndex('fileId', 'fileId', {unique: false});
    fileTagsStore.createIndex('tagId', 'tagId', {unique: false});
    fileTagsStore.createIndex('fileId-tagId', ['fileId', 'tagId'], {unique: true});

    // test db items
    tagsStore.transaction.oncomplete = (e) => {
      const trans = database.transaction(['libraries', 'tags'], 'readwrite');

      const timeStamp = getTimestamp();
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
  name = sanitizeName(name);
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
  name = sanitizeName(name);

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

function dedupFiles(files, libraryId, trans, fStore) {
  return new Promise((resolve, reject) => {
    const withoutDups = [];
    const promises = [];

    const index = fStore.index('path-libraryId');
    for (const file of files) {
      promises.push(new Promise((resolve, reject) => {
        const request = index.get([file.path, libraryId]);
        request.onsuccess = (e) => {
          if (e.target.result === undefined) {
            // not a duplicate
            withoutDups.push(file);
          }
          resolve();
        };
        request.onerror = handleError(reject);
      }));
    }

    Promise.all(promises).then(
      () => { resolve(withoutDups); },
      reject
    );
  });
}

export function createImport(imp) {
  let files = [];

  for (const filePath in imp.files) {
    const fileInfo = imp.files[filePath];
    files.push({
      path: filePath,
      importId: imp.id,
      libraryId: imp.libraryId,
      bitDepth: fileInfo.bitDepth,
      channels: fileInfo.channels,
      durationMs: fileInfo.durationMs,
      sampleRate: fileInfo.sampleRate,
      plays: 0,
      lastPlayed: null
    });
  }

  return db.then(db => new Promise(
    (resolve, reject) => {
      const trans = db.transaction(['imports', 'files'], 'readwrite');

      const abort = (error) => {
        trans.abort();
        reject(error);
      }

      const promises = [];

      const iStore = trans.objectStore('imports');
      promises.push(promisifyRequest(iStore.add({
        id: imp.id,
        libraryId: imp.libraryId,
        timeCreated: getTimestamp()
      })));

      const fStore = trans.objectStore('files');

      dedupFiles(files, imp.libraryId, trans, fStore).then(
        files => {
          for (const file of files) {
            promises.push(promisifyRequest(fStore.add(file)));
          }
          Promise.all(promises).then(
            resolve,
            handleError(reject)
          );
        },
        (err) => {
          abort();
        }
      );
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
