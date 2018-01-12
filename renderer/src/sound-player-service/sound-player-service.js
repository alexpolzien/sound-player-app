let player = null;

const numChannels = 2;
const sr = 44100;

class SoundPlayer {
  constructor(ctx) {
    this.ctx = ctx;
    this.isPlaying = false;
  }

  playFromBuffer(fileBuffer) {
    const bufferSrc = this.ctx.createBufferSource();

    const numFrames = fileBuffer.left.length;
    const buffer = this.ctx.createBuffer(numChannels, numFrames, fileBuffer.sampleRate);

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    for (let i = 0; i < numFrames; i++) {
      leftChannel[i] = fileBuffer.left[i];
      rightChannel[i] = fileBuffer.right[i];
    }

    bufferSrc.buffer = buffer;
    bufferSrc.connect(this.ctx.destination);
    bufferSrc.onended = (e) => {
      console.log('end', e);
    }
    bufferSrc.start();
  }
}

export function initPlayer(win) {
  player = new SoundPlayer(new win.AudioContext());
}

export function getPlayer() {
  return player;
}
