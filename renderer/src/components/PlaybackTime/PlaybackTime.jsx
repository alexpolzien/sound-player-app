import React from 'react';
import {connect} from 'react-redux';

import styles from './PlaybackTime.css';

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
  const ms = Math.round((secs - seconds) * 1000);
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

class PlaybackTimeMain extends React.Component {
  render() {
    const {file, buffer} = this.props;
    if (file === null || buffer === null) {
      return null;
    }

    const totalTimeSecs = buffer.left.length * 1.0 / buffer.sampleRate;

    return <div className={styles.container}>00:00:00.000 / <TimeCounter secs={totalTimeSecs} /></div>;
  }
}

export default connect(mapState, null)(PlaybackTimeMain);
