let player = null;

const numChannels = 2;
const sr = 44100;

class SoundPlayer {
  constructor(ctx) {
    this.ctx = ctx;
    this.isPlaying = false;
  }

  playFromBuffer(fileBuffer) {
    console.log('playing', fileBuffer);

    const bufferSrc = this.ctx.createBufferSource();

    // TODO: sampleRate
    const numFrames = fileBuffer.left.length;
    const buffer = this.ctx.createBuffer(numChannels, numFrames, sr);

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    for (let i = 0; i < numFrames; i++) {
      leftChannel[i] = fileBuffer.left[i];
      rightChannel[i] = fileBuffer.right[i];
    }

    bufferSrc.buffer = buffer;
    bufferSrc.connect(this.ctx.destination);
    bufferSrc.start();
  }
}

export function initPlayer(win) {
  player = new SoundPlayer(new win.AudioContext());
}

export function getPlayer() {
  return player;
}
