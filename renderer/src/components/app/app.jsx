import styles from './App.css';

import React from 'react';
import {Provider} from 'react-redux';

import ClickerContainer from '../ClickerContainer/ClickerContainer.jsx';
import Counter from '../Counter/Counter.jsx';

export default class App extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div className={styles.app}>
          <Counter />
          <br />
          <br />
          <ClickerContainer />
        </div>
      </Provider>
    );
  }
}
