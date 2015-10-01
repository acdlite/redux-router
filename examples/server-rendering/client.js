import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';

import {
  ReduxRouter,
  reduxReactRouter,
} from 'redux-router';

import { Provider } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import createHistory from 'history/lib/createBrowserHistory';

import routes from './routes';
import reducer from './reducer';
import {MOUNT_ID} from './constants';

const store = compose(
  reduxReactRouter({ createHistory }),
  devTools()
)(createStore)(reducer, window.__initialState);

const rootComponent = (
  <Provider store={store}>
    <ReduxRouter routes={routes} />
  </Provider>
);

const mountNode = document.getElementById(MOUNT_ID);

// First render to match markup from server
ReactDOM.render(rootComponent, mountNode);
// Optional second render with dev-tools
ReactDOM.render((
  <div>
    {rootComponent}
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>
), mountNode);
