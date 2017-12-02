import {decodeFile} from '../decode-service/decode-service';

class BufferCache {
  constructor() {
    this.map = new Map();
  }

  getBufferData(filePath) {
    // return a promise that resolves with the data for the file path
    return new Promise(
      (resolve, reject) => {
        const buffer = this.map.get(filePath);

        if (buffer !== undefined) {
          resolve(buffer);
        } else {
          decodeFile(filePath).then(
            buffer => {
              this.map.set(filePath, buffer);
              resolve(buffer);
              // TODO: evict
            }
          );
        }
      }
    );
  }
}
