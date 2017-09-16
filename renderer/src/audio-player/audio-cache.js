class AudioCache {
  constructor() {
    this.map = new Map();
  }

  getBuffer(fileId) {
    console.log(this.map);
    return this.map.get(fileId);
  }

  setBuffer(fileId, buffer) {
    this.map.set(fileId, buffer);
  }
}

const audioCache = new AudioCache();
export default audioCache;
