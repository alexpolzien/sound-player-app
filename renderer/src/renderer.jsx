require('./main.css');

require('react-hot-loader/patch');

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {AppContainer} from 'react-hot-loader';

import App from './components/App/App.jsx';
import {testReducer} from './reducers.js';

let store = createStore(testReducer);

function renderApp(RootComponent) {
  ReactDOM.render(
    <AppContainer>
      <RootComponent store={store} />
    </AppContainer>,
    document.getElementById('app')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp(App);
});

if (module.hot) {
  module.hot.accept('./components/App/App.jsx', () => {
    const App = require('./components/App/App.jsx').default;
    renderApp(App);
  });
}
