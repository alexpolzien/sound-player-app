import React from 'react';

import styles from './PlaybackTime.css';
import withPlaybackTime from '../enhancers/with-playback-time.jsx';

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

class TimeCounter extends React.PureComponent {
  render() {
    const {secs} = this.props;
    const time = calcTime(secs);
    return <span>{time.hours}:{time.mins}:{time.seconds}.{zeroPad(time.ms)}</span>
  }
}

class PlaybackTimeMain extends React.Component {
  render() {
    const {currentTime, totalTime} = this.props;
    if (currentTime === null || totalTime === null) {
      return null;
    }

    return <div className={styles.container}><TimeCounter secs={currentTime} /> / <TimeCounter secs={totalTime} /></div>;
  }
}

export default withPlaybackTime(PlaybackTimeMain);
