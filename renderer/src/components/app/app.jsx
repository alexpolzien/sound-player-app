import styles from './app.css';

import React from 'react';

import Counter from '../counter/counter.jsx';

export default class App extends React.Component {
  render() {
    return <div className={styles.app}><Counter /></div>;
  }
}
