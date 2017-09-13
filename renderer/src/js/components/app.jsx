import styles from '../../css/app.css';

import React from 'react';

import Counter from './counter.jsx';

export default class App extends React.Component {
  render() {
    return <div className={styles.app}><Counter /></div>;
  }
}
