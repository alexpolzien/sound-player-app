require('./main.css');

require('react-hot-loader/patch');

import {ipcRenderer, remote} from 'electron';
const os = remote.require('os');
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {DB_LOAD_INITIAL_RESULTS, PLAYBACK_SET_STOPPED} from './actions/action-types';
import {createNewImport} from './actions/actions';
import App from './components/App/App.jsx';
import rootReducer from './reducers/reducers';
import rootSaga from './sagas/sagas';
import {getPlayer, initPlayer} from './sound-player-service/sound-player-service';

// worker test stuff
import TestWorker from './workers/test-worker.worker';
import WorkerPool from './worker-pool/WorkerPool';

const pool = new WorkerPool(
  () => new TestWorker(),
  (e) => {
    console.log('got message from worker', e.data.num);
  },
  os.cpus().length,
  (e) => e.data.num === 100,
  1000
);

/*for (let i = 0; i < 100; i++) {
  pool.requestJob({});
}*/

// end worker test stuff

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
  initPlayer(window);
  const player = getPlayer();
  player.addStopListener(() => {
    store.dispatch({type: PLAYBACK_SET_STOPPED});
  });
  renderApp(App);
});

ipcRenderer.on('importfiles', (event, message) => {
  store.dispatch(createNewImport(message));
});

if (module.hot) {
  module.hot.accept('./components/App/App.jsx', () => {
    const App = require('./components/App/App.jsx').default;
    renderApp(App);
  });
}
