import React from 'react';

import styles from './PlaybackControls.css';
import PlayButton from '../PlayButton/PlayButton.jsx';

export default class PlaybackControls extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftSide}></div>
        <div className={styles.playButtonContainer}>
          <PlayButton />
        </div>
        <div className={styles.rightSide}></div>
      </div>
    );
  }
}
