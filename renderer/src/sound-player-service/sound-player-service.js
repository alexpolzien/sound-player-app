let player = null;

const numChannels = 2;
const sr = 44100;

class SoundPlayer {
  constructor(ctx, eventCallbacks = {}) {
    this.ctx = ctx;
    this.isPlaying = false;
    this.bufferSrc = null;
    this.onStop = eventCallbacks.onStop;
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
    bufferSrc.onended = this._onEnd.bind(this);
    bufferSrc.start();
  }

  stop() {
    // TODO
  }

  _onEnd() {
    if (this.onStop) {
      this.onStop();
    }
  }
}

export function initPlayer(win, callbacks) {
  player = new SoundPlayer(new win.AudioContext(), callbacks);
}

export function getPlayer() {
  return player;
}
