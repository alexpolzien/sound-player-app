import styles from './App.css';

import React from 'react';
import {Provider} from 'react-redux';

import FileListContainer from '../FileListContainer/FileListContainer.jsx';
import PlayButtonContainer from '../PlayButtonContainer/PlayButtonContainer.jsx';
import ResultsList from '../ResultsList/ResultsList.jsx';

export default class App extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <ResultsList />
      </Provider>
    );
  }
}
