require('../css/main.css');

require('react-hot-loader/patch');

const React = require('react');
const ReactDOM = require('react-dom');
const {AppContainer} = require('react-hot-loader');

const App = require('./components/app.jsx').default;

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
  module.hot.accept('./components/app.jsx', () => {
    const App = require('./components/app.jsx').default;
    renderApp(App);
  });
}
