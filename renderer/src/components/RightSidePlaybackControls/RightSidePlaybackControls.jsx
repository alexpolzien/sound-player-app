import React from 'react';

import styles from './RightSidePlaybackControls.css';
import VolumeSlider from '../VolumeSlider/VolumeSlider.jsx';

export default class RightSidePlaybackControls extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <VolumeSlider />
      </div>
    );
  }
}
