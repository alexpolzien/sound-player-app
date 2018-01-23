import AV from 'av';

onmessage = function(e) {
  const message = e.data;
  console.log(message);

  switch (message.jobType) {
    case 'metadata':
      decodeMetaData(message);
      break;
  }
}

function decodeMetaData(message) {
  const asset = AV.Asset.fromBuffer(message.buffer);

  asset.on('error', (e) => {
    // TODO: error handling
  });

  const formatPromise = new Promise(
    (resolve, reject) => {
      asset.on('format', resolve);
    }
  );

  const durationPromise = new Promise(
    (resolve, reject) => {
      asset.on('duration', resolve);
    }
  )

  Promise.all([formatPromise, durationPromise]).then(
    ([format, duration]) => {
      asset.stop();
      postMessage({
        messageType: 'metadata',
        sampleRate: format.sampleRate,
        channels: format.channelsPerFrame,
        bitDepth: format.bitsPerChannel,
        durationMs: duration,
        filePath: message.filePath,
        importId: message.importId
      });
    }
  );

  asset.start();
}
