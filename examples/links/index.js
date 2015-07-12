import { routerStateReducer, reduxRouteComponent, transitionTo } from '../../src';
import { LOCATION_DID_CHANGE } from '../../src/actionTypes';
import { history } from 'react-router/lib/BrowserHistory';
import { createStore } from 'redux';
import { Connector } from 'redux/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import pure from 'react-pure-component';

function reducer(state = {}, action) {
  return {
    router: routerStateReducer(state.router, action)
  };
}

const store = createStore(reducer);

const barState = {
  pathname: '/bar',
  query: {
    baz: 'foo'
  },
  navigationType: 'POP',
  state: {
    key: 'fbfv9pchy83t0529'
  },
  params: {}
};

const fooState = {
  pathname: '/foo',
  query: {
    bar: 'baz'
  },
  navigationType: 'PUSH',
  state: {
    key: 'q7ugo9odofq7iudi'
  },
  params: {}
};


function externalStateChange(state) {
  return {
    type: LOCATION_DID_CHANGE,
    payload: state
  };
}

const App = pure(() => (
  <Connector select={s => s}>{({ dispatch, router }) => (
    <div>
      <p>Works with <code>{'<Link />'}</code>:</p>
      <Link to="/foo?bar=baz">Foo</Link>
      <Link to="/bar?baz=foo">Bar</Link>
      <p>Works with <code>transitionTo()</code> action creator:</p>
      <button onClick={() => dispatch(transitionTo('/foo?bar=baz'))}>Foo</button>
      <button onClick={() => dispatch(transitionTo('/bar?baz=foo'))}>Bar</button>
      <p>Works when store state is updated via some other mechanism like devtools or deserialization (check URL):</p>
      <button onClick={() => dispatch(externalStateChange(fooState))}>Foo</button>
      <button onClick={() => dispatch(externalStateChange(barState))}>Bar</button>
      <p>Location: {JSON.stringify(router)}</p>
    </div>
  )}</Connector>
));

const Foo = pure(() => <div>Foo</div>);
const Bar = pure(() => <div>Bar</div>);

ReactDOM.render((
  <Router history={history}>
    <Route component={reduxRouteComponent(store)}>
      <Route path="/" component={App}>
        <Route path="/foo" component={Foo} />
        <Route path="/bar" component={Bar} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));
