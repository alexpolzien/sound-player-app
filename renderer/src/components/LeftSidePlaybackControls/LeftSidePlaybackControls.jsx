import React from 'react';

import AutoButton from '../AutoButton/AutoButton.jsx';
import styles from './LeftSidePlaybackControls.css';

export default class LeftSidePlaybackControls extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <AutoButton />
      </div>
    );
  }
}
