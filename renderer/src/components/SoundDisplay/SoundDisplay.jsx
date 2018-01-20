import React from 'react';

import styles from './SoundDisplay.css';
import PlaybackTime from '../PlaybackTime/PlaybackTime.jsx';
import WaveformDragSource from '../WaveformDragSource/WaveformDragSource.jsx';
import WaveformView from '../WaveformView/WaveformView.jsx'

export default class SoundDisplay extends React.Component {
  render() {
    const {file, buffer} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.wave}>
          <WaveformView />
        </div>
        <div className={styles.time}>
          <PlaybackTime />
        </div>
        <div className={styles.dragSource}>
          <WaveformDragSource />
        </div>
      </div>
    );
  }
}
