import {decodeFile} from '../decode-service/decode-service';

const cacheMap = new Map();

export function getBufferData(filePath) {
  // return a promise that resolves with the data for the file path
  return new Promise(
    (resolve, reject) => {
      const buffer = cacheMap.get(filePath);

      if (buffer !== undefined) {
        resolve(buffer);
      } else {
        decodeFile(filePath).then(
          buffer => {
            cacheMap.set(filePath, buffer);
            resolve(buffer);
            // TODO: evict
          }
        );
      }
    }
  );
}
