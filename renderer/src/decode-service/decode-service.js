import AV from 'av';
import {remote} from 'electron';
const fs = remote.require('fs');

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
      console.log('buffer', buffer.buffer);
      const asset = AV.Asset.fromBuffer(buffer);
      asset.decodeToBuffer(data => {
        const numChannels = 2; // hard-coded to stereo for now
        const numFrames = data.length / numChannels;
        const leftChannel = new Float32Array(numFrames);
        const rightChannel = new Float32Array(numFrames);
        for (let i = 0; i < numFrames; i++) {
          leftChannel[i] = data[i * 2];
          rightChannel[i] = data[i * 2 + 1];
        }
        resolve({
          sampleRate: asset.format.sampleRate,
          left: leftChannel,
          right: rightChannel
        });
      });
    }
  );
}

export function decodeFile(filePath) {
  //const filePath = path.join(SOUNDS_DIR, filename);
  return getFileBuffer(filePath).then(decodeFileBuffer);
}
