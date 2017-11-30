import React from 'react';

import styles from './PlayButton.css';

export default class PlayButton extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.button}>
          <div className={styles.triangle}></div>
          <div className={styles.pauseBlocks}></div>
        </div>
      </div>
    );
  }
}
