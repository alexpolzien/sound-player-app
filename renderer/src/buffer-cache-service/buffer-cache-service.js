import {decodeFile} from '../decode-service/decode-service';

const MIN_CACHE_ITEMS = 5;
const MAX_SIZE_MB = 50;
const BYTES_PER_FRAME = 4;
const BYTES_PER_MB = 1024 * 1024;

const cacheMap = new Map();
let currentSizeMb = 0; // estimated current cache size
let currentNumItems = 0;

function bufferSizeMb(buffer) {
  const bytes = buffer.left.length * 2 * BYTES_PER_FRAME;
  return bytes * 1.0 / BYTES_PER_MB;
}

function evict() {
  const evictList = [];
  for (let [filePath, item] of cacheMap) {
    evictList.push({filePath, lastAccess: item.lastAccess, buffer: item.buffer});
  }

  // sort least-recently used to the top
  evictList.sort((a, b) => {
    if (a.lastAccess < b.lastAccess) {
      return -1;
    } else if (a.lastAccess > b.lastAccess) {
      return 1;
    } else {
      return 0;
    }
  });


  let numEvicted = 0;
  while (currentSizeMb > (MAX_SIZE_MB / 2) && currentNumItems >= MIN_CACHE_ITEMS) {
    const toRemove = evictList.shift();
    cacheMap.delete(toRemove.filePath);
    currentSizeMb -= bufferSizeMb(toRemove.buffer);
    currentNumItems--;
    numEvicted++;
  }
  console.log(`Evicted ${numEvicted} items from audio buffer cache.`)
  console.log(`Current estimated cache size is ${currentSizeMb}MB.`);
}

export function getBufferData(filePath) {
  // return a promise that resolves with the data for the file path
  return new Promise(
    (resolve, reject) => {
      const cacheItem = cacheMap.get(filePath);

      if (cacheItem !== undefined) {
        cacheItem.lastAccess = new Date();
        resolve(cacheItem.buffer);
      } else {
        decodeFile(filePath).then(
          buffer => {
            cacheMap.set(filePath, {buffer, lastAccess: new Date()});

            currentSizeMb += bufferSizeMb(buffer);
            currentNumItems++;

            // evict old items if the cache is too full
            if (currentSizeMb > MAX_SIZE_MB && currentNumItems > MIN_CACHE_ITEMS) {
              window.requestIdleCallback(evict);
            }

            resolve(buffer);
          }
        );
      }
    }
  );
}
