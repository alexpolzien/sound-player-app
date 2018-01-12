import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import styles from './SoundDisplay.css';
import PlaybackTime from '../PlaybackTime/PlaybackTime.jsx';
import WaveformView from '../WaveformView/WaveformView.jsx'

function mapState(state) {
  return {
    file: state.audioCache.file,
    buffer: state.audioCache.buffer
  };
}

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
      </div>
    );
  }
}

// export default connect(mapState, null)(SoundDisplayMain);
