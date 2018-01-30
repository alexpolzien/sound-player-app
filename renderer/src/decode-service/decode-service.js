import AV from 'av';
import {remote} from 'electron';
const fs = remote.require('fs');
const os = remote.require('os');

import {
  IMPORT_BUFFER_READ,
  IMPORT_METADATA_DECODED
} from '../actions/action-types';
import DecoderWorker from '../workers/decoder-worker.worker';
import {copyWithoutEntries} from '../utils/object-utils';
import WorkerPool from '../worker-pool/WorkerPool';

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
  os.cpus().length,
  (e) => {
    if (e.data.responseType === 'metadata') {
      return true;
    }
  },
  16
);

const createDecoderMiddleware = () => store => {
  decoderPool.addMessageListener(event => {
    const message = event.data;

    switch (message.responseType) {
      case 'metadata':
        store.dispatch({
          type: IMPORT_METADATA_DECODED,
          ...copyWithoutEntries(message, 'responseType')
        })
      default:
        break;
    }
  });

  return next => action => {
    if (action.type === IMPORT_BUFFER_READ) {
      decoderPool.requestJob({
        jobType: 'metadata',
        buffer: action.buffer,
        filePath: action.filePath,
        importId: action.importId
      });
    }

    next(action);
  }
}

export const decoderMiddleware = createDecoderMiddleware();
