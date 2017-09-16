import AV from 'av';

import audioCache from './audio-cache';

class AudioPlayer {
  constructor(cache) {
    this.cache = cache;
    this.player = null;
  }

  playFile(fileId) {
    /*if (this.player) {
      this.player.stop();
    }*/
    const buffer = new AV.Buffer(this.cache.getBuffer(fileId));
    console.log(buffer);
    this.player = AV.Player.fromBuffer(buffer);
    this.player.preload();
    this.player.on('ready', () => {
      this.player.play();
    });
  }
}

const player = new AudioPlayer(audioCache);
export default player;
