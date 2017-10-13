require('./main.css');

require('react-hot-loader/patch');

import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {DB_LOAD_INITIAL_RESULTS} from './actions/action-types';
import App from './components/App/App.jsx';
import rootReducer from './reducers/reducers';
import rootSaga from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    stateSanitizer: state => {
      const bufferCache = state.bufferCache;
      const sanitizedCache = {};

      for (const fileId in bufferCache) {
        const fileData = bufferCache[fileId];
        const sanitizedData = {...fileData};
        sanitizedData.left = `Float32Array(${fileData.left.length})`;
        sanitizedData.right = `Float32Array(${fileData.right.length})`;
        sanitizedCache[fileId] = sanitizedData;
      }

      return {
        ...state,
        bufferCache: sanitizedCache
      };
    }
  }) : compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);
store.dispatch({type: DB_LOAD_INITIAL_RESULTS});

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
