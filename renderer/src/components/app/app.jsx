import styles from './App.css';

import React from 'react';
import {Provider} from 'react-redux';

import AppLayout from '../AppLayout/AppLayout.jsx';

export default class App extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <AppLayout />
      </Provider>
    );
  }
}
