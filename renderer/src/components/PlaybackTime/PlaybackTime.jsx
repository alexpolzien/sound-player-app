import React from 'react';
import {connect} from 'react-redux';

import styles from './PlaybackTime.css';
import {getPlayer} from '../../sound-player-service/sound-player-service';

function mapState(state) {
  return {
    buffer: state.audioBuffer.buffer,
    file: state.audioBuffer.file
  }
}

function calcTime(secs) {
  const hours = Math.floor(secs / (60 * 60));
  secs -= hours * 60 * 60;
  const mins = Math.floor(secs / 60);
  secs -= mins * 60;
  const seconds = Math.floor(secs);
  const ms = Math.floor((secs - seconds) * 1000);
  return {hours, mins, seconds, ms};
}

function zeroPad(ms) {
  let str = ms.toString();
  while (str.length < 3) {
    str = '0' + str;
  }
  return str;
}

class TimeCounter extends React.Component {
  render() {
    const {secs} = this.props;
    const time = calcTime(secs);
    return <span>{time.hours}:{time.mins}:{time.seconds}.{zeroPad(time.ms)}</span>
  }
}

// TODO: this needs to be optimized
class PlaybackTimeMain extends React.Component {
  constructor() {
    super(...arguments);
    this.onPlaybackPositionChanged = this._onPlaybackPositionChanged.bind(this);
    this.state = {
      playbackTime: 0
    };
  }

  componentDidMount() {
    const player = getPlayer(); // TODO: pass via context or something else?
    player.addPlaybackPositionListener(this.onPlaybackPositionChanged);
  }

  componentWillUnmount() {
    const player = getPlayer();
    player.removePlaybackPositionListener(this.onPlaybackPositionChanged);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.setState({playbackTime: 0});
    }
  }

  _onPlaybackPositionChanged(timeElapsed, file) {
    if (this.props.file && file.id === this.props.file.id) {
      this.setState({playbackTime: timeElapsed});
    }
  }

  render() {
    const {file, buffer} = this.props;
    const {playbackTime} = this.state;
    if (file === null || buffer === null) {
      return null;
    }

    const totalTimeSecs = buffer.left.length * 1.0 / buffer.sampleRate;

    return <div className={styles.container}><TimeCounter secs={playbackTime} /> / <TimeCounter secs={totalTimeSecs} /></div>;
  }
}

export default connect(mapState, null)(PlaybackTimeMain);
