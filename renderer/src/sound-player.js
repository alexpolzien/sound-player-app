class SoundPlayer {
  constructor() {
    this.ctx = new window.AudioContext();
  }

  play(soundData) {
    const buffer = this.ctx.createBuffer(2, soundData.left.length, soundData.sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    // TODO: faster way to do this?
    for (let i = 0; i < soundData.left.length; i++) {
      leftChannel[i] = soundData.left[i];
      rightChannel[i] = soundData.right[i];
    }

    const bufferSrc = this.ctx.createBufferSource();
    bufferSrc.buffer = buffer;
    bufferSrc.connect(this.ctx.destination);
    bufferSrc.start();
  }
}

const player = new SoundPlayer();
export default player;
