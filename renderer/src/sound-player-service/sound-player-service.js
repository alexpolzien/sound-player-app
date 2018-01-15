let player = null;

class SoundPlayer {
  static defaultGain = 0.8;
  static numChannels = 2;

  constructor(win, ctx) {
    this.win = win;
    this.ctx = ctx;
    this.isPlaying = false;
    this.playStartTime = null;
    this.bufferSrc = null;
    this.playingFile = null;
    this.playingFileBuffer = null;
    this.updatePlaybackPosition = this._updatePlaybackPosition.bind(this);
    this.onEnd = this._onEnd.bind(this);
    this.updatePlaybackPosition();
    this.playbackPositionListeners = [];
    this.gainLevelListeners = [];
    this.stopListeners = [];

    // connect the gain node
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = SoundPlayer.defaultGain;
    this.gainNode.connect(this.ctx.destination);
  }

  playFromBuffer(fileBuffer, file) {
    const bufferSrc = this.ctx.createBufferSource();

    const numFrames = fileBuffer.left.length;
    const buffer = this.ctx.createBuffer(this.constructor.numChannels, numFrames, fileBuffer.sampleRate);

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    for (let i = 0; i < numFrames; i++) {
      leftChannel[i] = fileBuffer.left[i];
      rightChannel[i] = fileBuffer.right[i];
    }

    bufferSrc.buffer = buffer;
    bufferSrc.connect(this.gainNode);
    bufferSrc.onended = this.onEnd;
    this.playStartTime = this.ctx.currentTime;
    this.bufferSrc = bufferSrc;
    this.playingFile = file;
    this.playingFileBuffer = fileBuffer;
    bufferSrc.start();
    this.isPlaying = true;
  }

  stop() {
    this.bufferSrc.stop();
  }

  _onEnd() {
    this.updatePlaybackPosition();

    this.bufferSrc.disconnect();
    this.isPlaying = false;
    this.playStartTime = null;
    this.bufferSrc = null;
    this.playingFile = null;
    this.playingFileBuffer = null;

    this.stopListeners.forEach(listener => {listener()});
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

  getGainLevel() {
    return this.gainNode.gain.value;
  }

  setGainLevel(value) {
    this.gainNode.gain.value = value;
    this.gainLevelListeners.forEach(listener => {listener(value)});
  }

  addGainLevelListener(callback) {
    this.gainLevelListeners.push(callback);
  }

  removeGainLevelListener(callback) {
    this.gainLevelListeners = this.gainLevelListeners.filter(listener => listener !== callback);
  }

  addStopListener(callback) {
    this.stopListeners.push(callback);
  }

  removeStopListener(callback) {
    this.stopListeners = this.stopListeners.filter(listener => listener !== callback);
  }
}

export function initPlayer(win) {
  player = new SoundPlayer(win, new win.AudioContext());
}

export function getPlayer() {
  return player;
}

export function waitForStop() {
  // returns a promise that resolves the next time the player stops

  function promiseFunc(resolve, reject) {
    function listener() {
      player.removeStopListener(listener);
      resolve();
    }
    player.addStopListener(listener);
  }

  if (!player.isPlaying) {
    return Promise.resolve();
  }

  return new Promise(promiseFunc);
}
