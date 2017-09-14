require('./main.css');

require('react-hot-loader/patch');

import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './components/App/App.jsx';
import rootReducer from './reducers/reducers';
import rootSaga from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

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
