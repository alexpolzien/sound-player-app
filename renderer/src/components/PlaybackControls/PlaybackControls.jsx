import React from 'react';

import PlayButton from '../PlayButton/PlayButton.jsx';
import styles from './PlaybackControls.css';

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
