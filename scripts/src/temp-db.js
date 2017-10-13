import AV from 'av';
import fs from 'fs';
import path from 'path';
import {v4} from 'uuid';

import {MOCK_DATA_DIR, SOUNDS_DIR} from './constants';

const dirBuffer = fs.readdirSync(SOUNDS_DIR);
const fileNames = [];
for (const fileName of dirBuffer) {
  fileNames.push(fileName);
}

const isWav = fileName => fileName.endsWith('.wav');
const promises = fileNames.filter(isWav).map(fileName =>
  new Promise(
    (resolve, reject) => {
      const absPath = path.join(SOUNDS_DIR, fileName);
      fs.readFile(absPath,
        (err, fileBuffer) => {
          const asset = AV.Asset.fromBuffer(fileBuffer);
          asset.decodeToBuffer(data => {
            resolve({
              id: v4(),
              fileName,
              sampleRate: asset.format.sampleRate,
              path: absPath
            });
          });
        }
      );
    }
  )
);

Promise.all(promises).then(
  fileInfos => {
    const jsonData = JSON.stringify(fileInfos);
    const dataFilePath = path.join(MOCK_DATA_DIR, 'mock-db.json');
    fs.writeFile(dataFilePath, jsonData,
      err => {
        if (err) {
          throw(err);
        }
        console.log(`wrote data for ${fileInfos.length} files`);
      }
    );
  }
);
