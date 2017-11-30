import React from 'react';

import PlaybackControls from '../PlaybackControls/PlaybackControls.jsx';
import ResultsList from '../ResultsList/ResultsList.jsx';
import styles from './AppLayout.css';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.list}>
          <ResultsList />
        </div>
        <div className={styles.player}>
          wave display
        </div>
        <div className={styles.playbackControls}>
          <PlaybackControls />
        </div>
      </div>
    );
  }
}
