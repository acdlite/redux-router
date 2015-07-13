import { routerStateReducer, reduxRouteComponent, transitionTo } from '../../src';
import { LOCATION_DID_CHANGE } from '../../src/actionTypes';
import { history } from 'react-router/lib/BrowserHistory';
import { createStore } from 'redux';
import { Connector } from 'react-redux';
import { batchedUpdates } from 'redux-batched-updates';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import pure from 'react-pure-component';

import devTools from './redux-devtools/index';
import DebugPanel from './redux-devtools/DebugPanel';
import ReduxMonitor from './redux-devtools/ReduxMonitor';

function reducer(state = {}, action) {
  return {
    router: routerStateReducer(state.router, action)
  };
}

const store = batchedUpdates(devTools()(createStore))(reducer);

const redState = {
  pathname: '/color',
  query: {
    hex: 'f00'
  },
  state: {
    key: 'fbfv9pchy83t0529'
  }
};

const blueState = {
  pathname: '/color',
  query: {
    hex: '00f'
  },
  state: {
    key: 'q7ugo9odofq7iudi'
  }
};


function externalStateChange(state) {
  return {
    type: LOCATION_DID_CHANGE,
    payload: state
  };
}

const App = pure(() => (
  <div>
    <Connector select={s => s}>{({ dispatch, router }) => (
      <div style={{
        backgroundColor: router.query && `#${router.query.hex}`,
        color: '#fff',
        transition: 'background-color 150ms ease-in-out',
        position: 'fixed',
        height: '100%',
        width: '100%'
      }}>
        <p>Works with <code>{'<Link />'}</code>:</p>
        <Link to="/color?hex=f00">Red</Link>
        <Link to="/color?hex=00f">Blue</Link>
        <p>Works with <code>transitionTo()</code> action creator:</p>
        <button onClick={() => dispatch(transitionTo('/color?hex=f00'))}>Red</button>
        <button onClick={() => dispatch(transitionTo('/color?hex=00f'))}>Blue</button>
        <p>Works when store state is updated via some other mechanism like devtools or deserialization (check URL):</p>
        <button onClick={() => dispatch(externalStateChange(redState))}>Red</button>
        <button onClick={() => dispatch(externalStateChange(blueState))}>Blue</button>
        <p>Location: {JSON.stringify(router)}</p>
      </div>
    )}</Connector>
    <DebugPanel top right bottom>
      <ReduxMonitor store={store} />
    </DebugPanel>
  </div>
));

const Foo = pure(() => <div>Foo</div>);

ReactDOM.render((
  <Router history={history}>
    <Route component={reduxRouteComponent(store)}>
      <Route path="/" component={App}>
        <Route path="/color" component={Foo} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));
