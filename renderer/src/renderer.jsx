require('./main.css');

require('react-hot-loader/patch');

import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from './components/app/app.jsx';

function renderApp(RootComponent) {
  ReactDOM.render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    document.getElementById('app')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp(App);
});

if (module.hot) {
  module.hot.accept('./components/app/app.jsx', () => {
    const App = require('./components/app/app.jsx').default;
    renderApp(App);
  });
}
