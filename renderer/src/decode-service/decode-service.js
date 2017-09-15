import AV from 'av';
import {remote} from 'electron';
const fs = remote.require('fs');
const path = remote.require('path');

import {SOUNDS_DIR} from '../constants';

function getFileBuffer(filePath) {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(filePath,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    }
  );
}

function decodeFileBuffer(buffer) {
  return new Promise(
    (resolve, reject) => {
      const asset = AV.Asset.fromBuffer(buffer);
      const startTime = new Date();
      asset.decodeToBuffer(data => {
        const endTime = new Date();
        const decodeTime = endTime - startTime;
        console.log('time spent decoding', decodeTime);
        resolve(data);
      });
    }
  );
}

export function decodeFile(filename) {
  const filePath = path.join(SOUNDS_DIR, filename);
  return getFileBuffer(filePath).then(decodeFileBuffer);
}
