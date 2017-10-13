import {remote} from 'electron';
const fs = remote.require('fs');
const path = remote.require('path');

import {MOCK_DATA_DIR} from '../constants';

const dbFilePath = path.join(MOCK_DATA_DIR, 'mock-db.json');

export function getInitialResults() {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(dbFilePath, (err, contents) => {
        if (err) {
          reject(err);
        } else {
          const data = JSON.parse(contents);
          resolve(data);
        }
      });
    }
  );
}
