import React, { Component, PropTypes } from 'react';
import { createStore, compose, combineReducers } from 'redux';

import { ReduxRouter, routerStateReducer, reduxReactRouter } from 'redux-router';

import { Route, Link } from 'react-router';
import { Provider, connect } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import createHistory from 'history/lib/createBrowserHistory';

connect(state => ({ routerState: state.router }))
class App extends Component {
  render() {
    const links = [
      '/',
      '/parent?foo=bar',
      '/parent/child?bar=baz',
      '/parent/child/123?baz=foo'
    ].map(l =>
      <p>
        <Link to={l}>{l}</Link>
      </p>
    );

    return (
      <div>
        <h1>App Container</h1>
        {links}
        {this.props.children}
      </div>
    );
  }
}
App.propTypes = {
  children: PropTypes.node
}

class Parent extends Component {
  render() {
    return (
      <div>
        <h2>Parent</h2>
        {this.props.children}
      </div>
    );
  }
}
Parent.propTypes = {
  children: PropTypes.node
}

class Child extends Component {
  render() {
    return (
      <div>
        <h2>Child</h2>
      </div>
    );
  }
}

const reducer = combineReducers({
  router: routerStateReducer
});

const store = compose(
  reduxReactRouter({ createHistory }),
  devTools()
)(createStore)(reducer);

class Root extends Component {
  createRoutes() {
    return (
      <ReduxRouter>
        <Route path="/" component={App}>
          <Route path="parent" component={Parent}>
            <Route path="child" component={Child} />
            <Route path="child/:id" component={Child} />
          </Route>
        </Route>
      </ReduxRouter>
    );
  }
  render() {
    return (
      <div>
        <Provider store={store}>
        { this.createRoutes }
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

React.render(<Root />, document.body);
