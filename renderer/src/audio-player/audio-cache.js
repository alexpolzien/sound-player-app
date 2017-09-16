class AudioCache {
  constructor() {
    this.map = new Map();
  }

  set(fileId, buffer) {
    this.map.set(fileId, buffer);
    console.log(this.map);
  }
}

const audioCache = new AudioCache();
export default audioCache;
