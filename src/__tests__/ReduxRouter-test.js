import {
  push,
  ReduxRouter,
  reduxReactRouter,
  routerStateReducer,
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
import { Link, Route, RouterContext } from 'react-router';
import jsdom from 'mocha-jsdom';
import sinon from 'sinon';

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
        <Link to={{ pathname: '/parent/child/321', query: { key: 'value' }}} />
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
  return (routerState, replace) => replace(null, pathname);
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

    store.dispatch(push({ pathname: '/parent/child/123', query: { key: 'value' } }));

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

  it('only renders once on initial load', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history
    })(createStore)(reducer);

    store.dispatch(push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    const historySpy = sinon.spy();
    history.listen(() => historySpy());

    renderIntoDocument(
      <Provider store={store}>
        <ReduxRouter>
          {routes}
        </ReduxRouter>
      </Provider>
    );

    expect(historySpy.callCount).to.equal(1);
  });

  it('should accept React.Components for "RoutingContext" prop of ReduxRouter', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history
    })(createStore)(reducer);

    store.dispatch(push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    const consoleErrorSpy = sinon.spy(console, 'error');

    renderIntoDocument(
      <Provider store={store}>
        <ReduxRouter RoutingContext={RouterContext}>
          {routes}
        </ReduxRouter>
      </Provider>
    );

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.called).to.be.false;
  });

  it('should accept stateless React components for "RoutingContext" prop of ReduxRouter', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history
    })(createStore)(reducer);

    store.dispatch(push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    const consoleErrorSpy = sinon.spy(console, 'error');

    renderIntoDocument(
      <Provider store={store}>
        <ReduxRouter RoutingContext={(props) => <RouterContext {...props}/>}>
          {routes}
        </ReduxRouter>
      </Provider>
    );

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.called).to.be.false;
  });

  it('should not accept non-React-components for "RoutingContext" prop of ReduxRouter', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history
    })(createStore)(reducer);

    store.dispatch(push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    class CustomRouterContext extends React.Component {
      render() {
        return <RouterContext {...this.props}/>;
      }
    }

    const consoleErrorSpy = sinon.spy(console, 'error');

    const render = () => renderIntoDocument(
      <Provider store={store}>
        <ReduxRouter RoutingContext={new CustomRouterContext({})}>
          {routes}
        </ReduxRouter>
      </Provider>
    );

    const invalidElementTypeErrorMessage = 'Element type is invalid: expected a string (for built-in components) ' +
      'or a class/function (for composite components) but got: object. ' +
      'Check the render method of `ReduxRouterContext`.';

    const routingContextInvalidElementTypeErrorMessage = 'React.createElement: type should not be null, undefined, boolean, or number. ' +
      'It should be a string (for DOM elements) or a ReactClass (for composite components). ' +
      'Check the render method of `ReduxRouterContext`.';

    expect(render).to.throw(invalidElementTypeErrorMessage);

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.calledTwice).to.be.true;

    expect(consoleErrorSpy.args[1][0]).to.contain(routingContextInvalidElementTypeErrorMessage);
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

      const store = server.reduxReactRouter({ routes, createHistory })(createStore)(reducer);
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

    it('should gracefully handle 404s', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      const store = server.reduxReactRouter({ routes, createHistory })(createStore)(reducer);
      expect(() => store.dispatch(server.match('/404', () => {})))
        .to.not.throw();
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

    it('throws if createHistory is not passed to store enhancer', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      expect(() => server.reduxReactRouter({ routes })(createStore)(reducer))
          .to.throw(
          'When rendering on the server, createHistory must be passed to the '
          + 'reduxReactRouter() store enhancer'
      );
    });

    it('handles redirects', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      const store = server.reduxReactRouter({ routes, createHistory })(createStore)(reducer);
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

      store.dispatch(push({ pathname: '/parent/child' }));
      const tree = renderIntoDocument(<RouterContainer />);


      expect(store.getState().router.params).to.eql({});
      tree.setState({ routes: newRoutes });
      expect(store.getState().router.params).to.eql({ route: 'child' });
    });
  });
});
