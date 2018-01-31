import React from 'react';

import AppHeader from '../AppHeader/AppHeader.jsx';
import PanelContainer from '../PanelContainer/PanelContainer.jsx';
import PlaybackControls from '../PlaybackControls/PlaybackControls.jsx';
import ResultsList from '../ResultsList/ResultsList.jsx';
import SoundDisplay from '../SoundDisplay/SoundDisplay.jsx';
import styles from './AppLayout.css';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <AppHeader />
        </div>
        <div className={styles.panels}>
          <PanelContainer />
        </div>
        <div className={styles.player}>
          <SoundDisplay />
        </div>
        <div className={styles.playbackControls}>
          <PlaybackControls />
        </div>
      </div>
    );
  }
}
