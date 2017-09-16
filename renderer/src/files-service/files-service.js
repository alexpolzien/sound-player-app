import {remote} from 'electron';
const fs = remote.require('fs');
const path = remote.require('path');

import {SOUNDS_DIR} from '../constants';

export function getFiles() {
  return new Promise(
    (resolve, reject) => {
      fs.readdir(SOUNDS_DIR, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const absPaths = files.map(file => {
            return {
              id: file, // use filename for id for now
              name: file,
              path: path.join(SOUNDS_DIR, file)
            };
          });
          resolve(absPaths);
        }
      })
    }
  );
}
