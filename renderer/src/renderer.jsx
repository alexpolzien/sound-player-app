require('./main.css');

require('react-hot-loader/patch');

import {ipcRenderer, remote} from 'electron';
const os = remote.require('os');
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {
  DB_LOAD_INITIAL_RESULTS,
  APP_INIT,
  PLAYBACK_SET_STOPPED
} from './actions/action-types';
import {createNewImport} from './actions/actions';
import App from './components/App/App.jsx';
import {initDb} from './db-service/db-service';
import {decoderMiddleware} from './decode-service/decode-service';
import {importerMiddleware} from './importer-service/importer-service';
import {ipcMiddleware} from './ipc-middleware/ipc-middleware';
import {initLocalStorage, localStorageMiddleware} from './local-storage-service/local-storage-service';
import rootReducer from './reducers/reducers';
import rootSaga from './sagas/sagas';
import {getPlayer, initPlayer} from './sound-player-service/sound-player-service';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    stateSanitizer: state => {
      const bufferCache = state.bufferCache;
      const sanitizedCache = {};

      // sanitize audo buffer data
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
  composeEnhancers(
    applyMiddleware(sagaMiddleware, decoderMiddleware,
      importerMiddleware, ipcMiddleware, localStorageMiddleware)
  )
);
sagaMiddleware.run(rootSaga);

initLocalStorage(window);

initDb(window);

//store.dispatch({type: DB_LOAD_INITIAL_RESULTS});
//store.dispatch({type: APP_INIT});

function renderApp(RootComponent) {
  ReactDOM.render(
    <AppContainer>
      <RootComponent store={store} />
    </AppContainer>,
    document.getElementById('app')
  );
  store.dispatch({type: APP_INIT});
}

document.addEventListener('DOMContentLoaded', () => {
  initPlayer(window);

  // TODO: use middleware instead
  const player = getPlayer();
  player.addStopListener(() => {
    store.dispatch({type: PLAYBACK_SET_STOPPED});
  });
  renderApp(App);
});

// TODO: use middleware instead
ipcRenderer.on('importfiles', (event, message) => {
  const state = store.getState();
  const libraryId = state.libraries.selectedId;
  store.dispatch(createNewImport(message, libraryId));
});

if (module.hot) {
  module.hot.accept('./components/App/App.jsx', () => {
    const App = require('./components/App/App.jsx').default;
    renderApp(App);
  });
}
