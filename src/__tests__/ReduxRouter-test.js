import {
  ReduxRouter,
  reduxReactRouter,
  routerStateReducer
} from '../';

import * as server from '../server';

import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag,
  Simulate
} from 'react-addons-test-utils';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import createHistory from 'history/lib/createMemoryHistory';
import { Link, Route } from 'react-router';
import jsdom from 'mocha-jsdom';

@connect(state => state.router)
class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  }

  render() {
    const { location, children } = this.props;
    return (
      <div>
        <p>{`Pathname: ${location.pathname}`}</p>
        {children}
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
        <Link to="/parent/child/321" query={{ key: 'value' }} />
        {this.props.children}
      </div>
    );
  }
}

class Child extends Component {
  render() {
    return (
      <div />
    );
  }
}

function redirectOnEnter(pathname) {
  return (routerState, replaceState) => replaceState(null, pathname);
}

const routes = (
  <Route path="/" component={App} onEnter={redirectOnEnter}>
    <Route path="parent" component={Parent}>
      <Route path="child" component={Child} />
      <Route path="child/:id" component={Child} />
    </Route>
    <Route path="redirect" onEnter={redirectOnEnter('/parent/child/850')} />
  </Route>
);


describe('<ReduxRouter>', () => {
  jsdom();

  function renderApp() {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history
    })(createStore)(reducer);

    history.pushState(null, '/parent/child/123?key=value');

    return renderIntoDocument(
      <Provider store={store}>
        <ReduxRouter>
          {routes}
        </ReduxRouter>
      </Provider>
    );
  }

  it('renders a React Router app using state from a Redux <Provider>', () => {
    const tree = renderApp();

    const child = findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    expect(child.props.location.query).to.eql({ key: 'value' });
    expect(child.props.params).to.eql({ id: '123' });
  });

  // <Link> does stuff inside `onClick` that makes it difficult to test.
  // They work in the example.
  // TODO: Refer to React Router tests once they're completed
  it.skip('works with <Link>', () => {
    const tree = renderApp();

    const child = findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    const link = findRenderedDOMComponentWithTag(tree, 'a');

    Simulate.click(link);
    expect(child.props.location.pathname).to.equal('/parent/child/321');
  });

  describe('server-side rendering', () => {
    it('works', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      const store = server.reduxReactRouter({ routes })(createStore)(reducer);
      store.dispatch(server.match('/parent/child/850?key=value', (err, redirectLocation, routerState) => {
        const output = renderToString(
          <Provider store={store}>
            <ReduxRouter />
          </Provider>
        );
        expect(output).to.match(/Pathname: \/parent\/child\/850/);
        expect(routerState.location.query).to.eql({ key: 'value' });
      }));
    });

    it('throws if routes are not passed to store enhancer', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      expect(() => server.reduxReactRouter()(createStore)(reducer))
        .to.throw(
          'When rendering on the server, routes must be passed to the '
        + 'reduxReactRouter() store enhancer; routes as a prop or as children '
        + 'of <ReduxRouter> is not supported. To deal with circular '
        + 'dependencies between routes and the store, use the '
        + 'option getRoutes(store).'
        );
    });

    it('handles redirects', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      const store = server.reduxReactRouter({ routes })(createStore)(reducer);
      store.dispatch(server.match('/redirect', (error, redirectLocation) => {
        expect(error).to.be.null;
        expect(redirectLocation.pathname).to.equal('/parent/child/850');
      }));
    });
  });

  describe('dynamic route switching', () => {
    it('updates routes wnen <ReduxRouter> receives new props', () => {
      const newRoutes = (
        <Route path="/parent/:route" component={App} />
      );

      const reducer = combineReducers({
        router: routerStateReducer
      });

      const history = createHistory();
      const store = reduxReactRouter({ history })(createStore)(reducer);

      class RouterContainer extends Component {
        state = { routes }

        render() {
          return (
            <Provider store={store}>
              <ReduxRouter routes={this.state.routes} />
            </Provider>
          );
        }
      }

      history.pushState(null, '/parent/child');
      const tree = renderIntoDocument(<RouterContainer />);


      expect(store.getState().router.params).to.eql({});
      tree.setState({ routes: newRoutes });
      expect(store.getState().router.params).to.eql({ route: 'child' });
    });
  });
});
