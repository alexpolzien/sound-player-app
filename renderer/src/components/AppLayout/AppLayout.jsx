import React from 'react';

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
          player here
        </div>
      </div>
    );
  }
}
