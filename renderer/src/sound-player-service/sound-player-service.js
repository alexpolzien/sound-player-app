let player = null;

const numChannels = 2;
const sr = 44100;

class SoundPlayer {
  constructor(win, ctx, eventCallbacks = {}) {
    this.win = win;
    this.ctx = ctx;
    this.isPlaying = false;
    this.playStartTime = null;
    this.bufferSrc = null;
    this.playingFile = null;
    this.playingFileBuffer = null;
    this.onStop = eventCallbacks.onStop;
    this.updatePlaybackPosition = this._updatePlaybackPosition.bind(this);
    this.updatePlaybackPosition();
    this.playbackPositionListeners = [];
  }

  playFromBuffer(fileBuffer, file) {
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
    this.playStartTime = this.ctx.currentTime;
    this.bufferSrc = bufferSrc;
    this.playingFile = file;
    this.playingFileBuffer = fileBuffer;
    bufferSrc.start();
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
    this.playStartTime = null;
    this.bufferSrc = null;
    this.playingFile = null;
    this.playingFileBuffer = null;
    if (this.onStop) {
      this.onStop();
    }
  }

  _onEnd() {
    this.updatePlaybackPosition();
    this.isPlaying = false;
    if (this.onStop) {
      this.onStop();
    }
  }

  _updatePlaybackPosition() {
    if (this.isPlaying) {
      const totalLength = this.playingFileBuffer.left.length * 1.0 / this.playingFileBuffer.sampleRate;
      const elapsed = Math.min(this.ctx.currentTime - this.playStartTime, totalLength);
      const playingFile = this.playingFile;
      this.playbackPositionListeners.forEach(listener => {listener(elapsed, playingFile)});
    }
    this.win.requestAnimationFrame(this.updatePlaybackPosition);
  }

  addPlaybackPositionListener(callback) {
    this.playbackPositionListeners.push(callback);
  }

  removePlaybackPositionListener(callback) {
    this.playbackPositionListeners = this.playbackPositionListeners.filter(listener => listener !== callback);
  }
}

export function initPlayer(win, callbacks) {
  player = new SoundPlayer(win, new win.AudioContext(), callbacks);
}

export function getPlayer() {
  return player;
}
