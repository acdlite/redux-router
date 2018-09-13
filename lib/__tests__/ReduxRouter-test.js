'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('../');

var _server = require('../server');

var server = _interopRequireWildcard(_server);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDomServer = require('react-dom/server');

var _reactDomTestUtils = require('react-dom/test-utils');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _historyLibCreateMemoryHistory = require('history/lib/createMemoryHistory');

var _historyLibCreateMemoryHistory2 = _interopRequireDefault(_historyLibCreateMemoryHistory);

var _sigfoxReactRouter = require('@sigfox/react-router');

var _mochaJsdom = require('mocha-jsdom');

var _mochaJsdom2 = _interopRequireDefault(_mochaJsdom);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var App = (function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, _App);

    _Component.apply(this, arguments);
  }

  App.prototype.render = function render() {
    var _props = this.props;
    var location = _props.location;
    var children = _props.children;

    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement(
        'p',
        null,
        'Pathname: ' + location.pathname
      ),
      children
    );
  };

  _createClass(App, null, [{
    key: 'propTypes',
    value: {
      children: _propTypes2['default'].node,
      location: _propTypes2['default'].object
    },
    enumerable: true
  }]);

  var _App = App;
  App = _reactRedux.connect(function (state) {
    return state.router;
  })(App) || App;
  return App;
})(_react.Component);

var Parent = (function (_Component2) {
  _inherits(Parent, _Component2);

  function Parent() {
    _classCallCheck(this, Parent);

    _Component2.apply(this, arguments);
  }

  Parent.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement(_sigfoxReactRouter.Link, { to: { pathname: '/parent/child/321', query: { key: 'value' } } }),
      this.props.children
    );
  };

  _createClass(Parent, null, [{
    key: 'propTypes',
    value: {
      children: _propTypes2['default'].node
    },
    enumerable: true
  }]);

  return Parent;
})(_react.Component);

var Child = (function (_Component3) {
  _inherits(Child, _Component3);

  function Child() {
    _classCallCheck(this, Child);

    _Component3.apply(this, arguments);
  }

  Child.prototype.render = function render() {
    return _react2['default'].createElement('div', null);
  };

  return Child;
})(_react.Component);

function redirectOnEnter(pathname) {
  return function (routerState, replace) {
    return replace(null, pathname);
  };
}

var routes = _react2['default'].createElement(
  _sigfoxReactRouter.Route,
  { path: '/', component: App, onEnter: redirectOnEnter },
  _react2['default'].createElement(
    _sigfoxReactRouter.Route,
    { path: 'parent', component: Parent },
    _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'child', component: Child }),
    _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'child/:id', component: Child })
  ),
  _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'redirect', onEnter: redirectOnEnter('/parent/child/850') })
);

describe('<ReduxRouter>', function () {
  _mochaJsdom2['default']();

  function renderApp() {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var store = _.reduxReactRouter({
      history: history
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    return _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(
      _reactRedux.Provider,
      { store: store },
      _react2['default'].createElement(
        _.ReduxRouter,
        null,
        routes
      )
    ));
  }

  it('renders a React Router app using state from a Redux <Provider>', function () {
    var tree = renderApp();

    var child = _reactDomTestUtils.findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    expect(child.props.location.query).to.eql({ key: 'value' });
    expect(child.props.params).to.eql({ id: '123' });
  });

  it('only renders once on initial load', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var store = _.reduxReactRouter({
      history: history
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    var historySpy = _sinon2['default'].spy();
    history.listen(function () {
      return historySpy();
    });

    _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(
      _reactRedux.Provider,
      { store: store },
      _react2['default'].createElement(
        _.ReduxRouter,
        null,
        routes
      )
    ));

    expect(historySpy.callCount).to.equal(1);
  });

  it('should accept React.Components for "RoutingContext" prop of ReduxRouter', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var store = _.reduxReactRouter({
      history: history
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    var consoleErrorSpy = _sinon2['default'].spy(console, 'error');

    _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(
      _reactRedux.Provider,
      { store: store },
      _react2['default'].createElement(
        _.ReduxRouter,
        { RoutingContext: _sigfoxReactRouter.RouterContext },
        routes
      )
    ));

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.called).to.be['false'];
  });

  it('should accept stateless React components for "RoutingContext" prop of ReduxRouter', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var store = _.reduxReactRouter({
      history: history
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    var consoleErrorSpy = _sinon2['default'].spy(console, 'error');

    _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(
      _reactRedux.Provider,
      { store: store },
      _react2['default'].createElement(
        _.ReduxRouter,
        { RoutingContext: function (props) {
            return _react2['default'].createElement(_sigfoxReactRouter.RouterContext, props);
          } },
        routes
      )
    ));

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.called).to.be['false'];
  });

  //TODO React 16 Error boundary related need to be fixed according to this new env
  it.skip('should not accept non-React-components for "RoutingContext" prop of ReduxRouter', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var store = _.reduxReactRouter({
      history: history
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));

    var CustomRouterContext = (function (_React$Component) {
      _inherits(CustomRouterContext, _React$Component);

      function CustomRouterContext() {
        _classCallCheck(this, CustomRouterContext);

        _React$Component.apply(this, arguments);
      }

      CustomRouterContext.prototype.render = function render() {
        return _react2['default'].createElement(_sigfoxReactRouter.RouterContext, this.props);
      };

      return CustomRouterContext;
    })(_react2['default'].Component);

    var consoleErrorSpy = _sinon2['default'].spy(console, 'error');

    var render = function render() {
      return _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(
        _reactRedux.Provider,
        { store: store },
        _react2['default'].createElement(
          _.ReduxRouter,
          { RoutingContext: new CustomRouterContext({}) },
          routes
        )
      ));
    };

    var invalidElementTypeErrorMessage = 'Element type is invalid: expected a string (for built-in components) ' + 'or a class/function (for composite components) but got: object. ' + 'Check the render method of `ReduxRouterContext`.';

    var routingContextInvalidPropErrorMessage = 'Invalid prop `RoutingContext` of type `object` supplied to `ReduxRouterContext`';

    var routingContextInvalidElementTypeErrorMessage = 'React.createElement: type should not be null, undefined, boolean, or number. ' + 'It should be a string (for DOM elements) or a ReactClass (for composite components). ' + 'Check the render method of `ReduxRouterContext`.';

    expect(render).to['throw'](invalidElementTypeErrorMessage);

    console.error.restore(); // eslint-disable-line no-console

    expect(consoleErrorSpy.calledTwice).to.be['true'];

    expect(consoleErrorSpy.args[0][0]).to.contain(routingContextInvalidPropErrorMessage);
    expect(consoleErrorSpy.args[1][0]).to.contain(routingContextInvalidElementTypeErrorMessage);
  });

  // <Link> does stuff inside `onClick` that makes it difficult to test.
  // They work in the example.
  // TODO: Refer to React Router tests once they're completed
  it.skip('works with <Link>', function () {
    var tree = renderApp();

    var child = _reactDomTestUtils.findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    var link = _reactDomTestUtils.findRenderedDOMComponentWithTag(tree, 'a');

    _reactDomTestUtils.Simulate.click(link);
    expect(child.props.location.pathname).to.equal('/parent/child/321');
  });

  describe('server-side rendering', function () {
    it('works', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var store = server.reduxReactRouter({ routes: routes, createHistory: _historyLibCreateMemoryHistory2['default'] })(_redux.createStore)(reducer);
      store.dispatch(server.match('/parent/child/850?key=value', function (err, redirectLocation, routerState) {
        var output = _reactDomServer.renderToString(_react2['default'].createElement(
          _reactRedux.Provider,
          { store: store },
          _react2['default'].createElement(_.ReduxRouter, null)
        ));
        expect(output).to.match(/Pathname: \/parent\/child\/850/);
        expect(routerState.location.query).to.eql({ key: 'value' });
      }));
    });

    it('should gracefully handle 404s', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var store = server.reduxReactRouter({ routes: routes, createHistory: _historyLibCreateMemoryHistory2['default'] })(_redux.createStore)(reducer);
      expect(function () {
        return store.dispatch(server.match('/404', function () {}));
      }).to.not['throw']();
    });

    it('throws if routes are not passed to store enhancer', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      expect(function () {
        return server.reduxReactRouter()(_redux.createStore)(reducer);
      }).to['throw']('When rendering on the server, routes must be passed to the ' + 'reduxReactRouter() store enhancer; routes as a prop or as children ' + 'of <ReduxRouter> is not supported. To deal with circular ' + 'dependencies between routes and the store, use the ' + 'option getRoutes(store).');
    });

    it('throws if createHistory is not passed to store enhancer', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      expect(function () {
        return server.reduxReactRouter({ routes: routes })(_redux.createStore)(reducer);
      }).to['throw']('When rendering on the server, createHistory must be passed to the ' + 'reduxReactRouter() store enhancer');
    });

    it('handles redirects', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var store = server.reduxReactRouter({ routes: routes, createHistory: _historyLibCreateMemoryHistory2['default'] })(_redux.createStore)(reducer);
      store.dispatch(server.match('/redirect', function (error, redirectLocation) {
        expect(error).to.be['null'];
        expect(redirectLocation.pathname).to.equal('/parent/child/850');
      }));
    });
  });

  describe('dynamic route switching', function () {
    it('updates routes wnen <ReduxRouter> receives new props', function () {
      var newRoutes = _react2['default'].createElement(_sigfoxReactRouter.Route, { path: '/parent/:route', component: App });

      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var history = _historyLibCreateMemoryHistory2['default']();
      var store = _.reduxReactRouter({ history: history })(_redux.createStore)(reducer);

      var RouterContainer = (function (_Component4) {
        _inherits(RouterContainer, _Component4);

        function RouterContainer() {
          _classCallCheck(this, RouterContainer);

          _Component4.apply(this, arguments);

          this.state = { routes: routes };
        }

        RouterContainer.prototype.render = function render() {
          return _react2['default'].createElement(
            _reactRedux.Provider,
            { store: store },
            _react2['default'].createElement(_.ReduxRouter, { routes: this.state.routes })
          );
        };

        return RouterContainer;
      })(_react.Component);

      store.dispatch(_.push({ pathname: '/parent/child' }));
      var tree = _reactDomTestUtils.renderIntoDocument(_react2['default'].createElement(RouterContainer, null));

      expect(store.getState().router.params).to.eql({});
      tree.setState({ routes: newRoutes });
      expect(store.getState().router.params).to.eql({ route: 'child' });
    });
  });
});