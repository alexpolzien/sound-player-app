import AV from 'av';
import {remote} from 'electron';
const fs = remote.require('fs');
const os = remote.require('os');

import WorkerPool from '../worker-pool/WorkerPool';
import DecoderWorker from '../workers/decoder-worker.worker';

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
  return getFileBuffer(filePath).then(decodeFileBuffer);
}

// begin worker pool version
export const decoderPool = new WorkerPool(
  () => new DecoderWorker(),
  (e) => {
    console.log('message from decoder worker', e)
  },
  os.cpus().length,
  (e) => true,
  100
);

//export function decodeMetaData()
