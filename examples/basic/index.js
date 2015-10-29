import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';

import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState,
} from 'redux-router';

import { Route, Link } from 'react-router';
import { Provider, connect } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { createHistory } from 'history';

@connect((state) => ({}))
class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { dispatch } = this.props;

    dispatch(pushState(null, '/parent/child/custom/'));
  }

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

        <a href="#" onClick={this.handleClick}>
          Custom click
        </a>
        {this.props.children}
      </div>
    );
  }
}

class Parent extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <h2>Parent</h2>
        {this.props.children}
      </div>
    );
  }
}

class Child extends Component {
  render() {
    const { params: { id }} = this.props;

    return (
      <div>
        <h2>Child</h2>
        {id && <p>{id}</p>}
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
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={App}>
              <Route path="parent" component={Parent}>
                <Route path="child" component={Child} />
                <Route path="child/:id" component={Child} />
              </Route>
            </Route>
          </ReduxRouter>
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
