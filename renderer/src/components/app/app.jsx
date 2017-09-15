import styles from './App.css';

import React from 'react';
import {Provider} from 'react-redux';

import ClickerContainer from '../ClickerContainer/ClickerContainer.jsx';
import FileListContainer from '../FileListContainer/FileListContainer.jsx';

export default class App extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div className={styles.app}>
          <ClickerContainer />
          <FileListContainer />
        </div>
      </Provider>
    );
  }
}
