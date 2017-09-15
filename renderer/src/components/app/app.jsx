import styles from './App.css';

import React from 'react';
import {Provider} from 'react-redux';

import FileListContainer from '../FileListContainer/FileListContainer.jsx';

export default class App extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div className={styles.app}>
          <FileListContainer />
        </div>
      </Provider>
    );
  }
}
