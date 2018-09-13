'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('../');

var _constants = require('../constants');

var _redux = require('redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sigfoxReactRouter = require('@sigfox/react-router');

var _historyLibCreateMemoryHistory = require('history/lib/createMemoryHistory');

var _historyLibCreateMemoryHistory2 = _interopRequireDefault(_historyLibCreateMemoryHistory);

var _historyLibUseBasename = require('history/lib/useBasename');

var _historyLibUseBasename2 = _interopRequireDefault(_historyLibUseBasename);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var routes = _react2['default'].createElement(
  _sigfoxReactRouter.Route,
  { path: '/' },
  _react2['default'].createElement(
    _sigfoxReactRouter.Route,
    { path: 'parent' },
    _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'child/:id' })
  )
);

describe('reduxRouter()', function () {
  it('adds router state to Redux store', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var store = _.reduxReactRouter({
      createHistory: _historyLibCreateMemoryHistory2['default'],
      routes: routes
    })(_redux.createStore)(reducer);

    var history = store.history;

    var historySpy = _sinon2['default'].spy();
    history.listen(function () {
      return historySpy();
    });

    expect(historySpy.callCount).to.equal(1);

    store.dispatch(_.push({ pathname: '/parent' }));
    expect(store.getState().router.location.pathname).to.equal('/parent');
    expect(historySpy.callCount).to.equal(2);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));
    expect(historySpy.callCount).to.equal(3);
    expect(store.getState().router.location.pathname).to.equal('/parent/child/123');
    expect(store.getState().router.location.query).to.eql({ key: 'value' });
    expect(store.getState().router.params).to.eql({ id: '123' });
  });

  it('detects external router state changes', function () {
    var baseReducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var EXTERNAL_STATE_CHANGE = 'EXTERNAL_STATE_CHANGE';

    var externalState = {
      location: {
        pathname: '/parent/child/123',
        query: { key: 'value' },
        key: 'lolkey'
      }
    };

    var reducerSpy = _sinon2['default'].spy();
    function reducer(state, action) {
      reducerSpy();

      if (action.type === EXTERNAL_STATE_CHANGE) {
        return _extends({}, state, { router: action.payload });
      }

      return baseReducer(state, action);
    }

    var history = _historyLibCreateMemoryHistory2['default']();
    var historySpy = _sinon2['default'].spy();

    var historyState = undefined;
    history.listen(function (s) {
      historySpy();
      historyState = s;
    });

    var store = _.reduxReactRouter({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    expect(reducerSpy.callCount).to.equal(2);
    expect(historySpy.callCount).to.equal(1);

    store.dispatch({
      type: EXTERNAL_STATE_CHANGE,
      payload: externalState
    });

    expect(reducerSpy.callCount).to.equal(4);
    expect(historySpy.callCount).to.equal(2);
    expect(historyState.pathname).to.equal('/parent/child/123');
    expect(historyState.search).to.equal('?key=value');
  });

  it('works with navigation action creators', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var store = _.reduxReactRouter({
      createHistory: _historyLibCreateMemoryHistory2['default'],
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));
    expect(store.getState().router.location.pathname).to.equal('/parent/child/123');
    expect(store.getState().router.location.query).to.eql({ key: 'value' });
    expect(store.getState().router.params).to.eql({ id: '123' });

    store.dispatch(_.replace({ pathname: '/parent/child/321', query: { key: 'value2' } }));
    expect(store.getState().router.location.pathname).to.equal('/parent/child/321');
    expect(store.getState().router.location.query).to.eql({ key: 'value2' });
    expect(store.getState().router.params).to.eql({ id: '321' });
  });

  it('doesn\'t interfere with other actions', function () {
    var APPEND_STRING = 'APPEND_STRING';

    function stringBuilderReducer(state, action) {
      if (state === undefined) state = '';

      if (action.type === APPEND_STRING) {
        return state + action.string;
      }
      return state;
    }

    var reducer = _redux.combineReducers({
      router: _.routerStateReducer,
      string: stringBuilderReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();

    var store = _.reduxReactRouter({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch({ type: APPEND_STRING, string: 'Uni' });
    store.dispatch({ type: APPEND_STRING, string: 'directional' });
    expect(store.getState().string).to.equal('Unidirectional');
  });

  it('stores the latest state in routerState', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();

    var store = _.reduxReactRouter({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    var historyState = undefined;
    history.listen(function (s) {
      historyState = s;
    });

    store.dispatch(_.push({ pathname: '/parent' }));

    store.dispatch({
      type: _constants.REPLACE_ROUTES
    });

    historyState = null;

    store.dispatch({ type: 'RANDOM_ACTION' });
    expect(historyState).to.equal(null);
  });

  it('handles async middleware', function (done) {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibCreateMemoryHistory2['default']();
    var historySpy = _sinon2['default'].spy();

    history.listen(function () {
      return historySpy();
    });
    expect(historySpy.callCount).to.equal(1);

    _redux.compose(_.reduxReactRouter({
      history: history,
      routes: routes
    }), _redux.applyMiddleware(function () {
      return function (next) {
        return function (action) {
          return setTimeout(function () {
            return next(action);
          }, 0);
        };
      };
    }))(_redux.createStore)(reducer);

    history.push({ pathname: '/parent' });
    expect(historySpy.callCount).to.equal(2);

    setTimeout(function () {
      expect(historySpy.callCount).to.equal(2);
      done();
    }, 0);
  });

  it('accepts history object when using basename', function () {
    var reducer = _redux.combineReducers({
      router: _.routerStateReducer
    });

    var history = _historyLibUseBasename2['default'](_historyLibCreateMemoryHistory2['default'])({
      basename: '/grandparent'
    });

    var store = _.reduxReactRouter({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch(_.push({ pathname: '/parent' }));
    expect(store.getState().router.location.pathname).to.eql('/parent');

    store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));
    expect(store.getState().router.location.pathname).to.eql('/parent/child/123');
    expect(store.getState().router.location.basename).to.eql('/grandparent');
    expect(store.getState().router.location.query).to.eql({ key: 'value' });
    expect(store.getState().router.params).to.eql({ id: '123' });
  });

  describe('getRoutes()', function () {
    it('is passed dispatch and getState', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var store = undefined;
      var history = _historyLibCreateMemoryHistory2['default']();

      _.reduxReactRouter({
        history: history,
        getRoutes: function getRoutes(s) {
          store = s;
          return routes;
        }
      })(_redux.createStore)(reducer);

      store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));
      expect(store.getState().router.location.pathname).to.equal('/parent/child/123');
    });
  });

  describe('onEnter hook', function () {
    it('can perform redirects', function () {
      var reducer = _redux.combineReducers({
        router: _.routerStateReducer
      });

      var history = _historyLibCreateMemoryHistory2['default']();

      var requireAuth = function requireAuth(nextState, redirect) {
        redirect({ pathname: '/login' });
      };

      var store = _.reduxReactRouter({
        history: history,
        routes: _react2['default'].createElement(
          _sigfoxReactRouter.Route,
          { path: '/' },
          _react2['default'].createElement(
            _sigfoxReactRouter.Route,
            { path: 'parent' },
            _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'child/:id', onEnter: requireAuth })
          ),
          _react2['default'].createElement(_sigfoxReactRouter.Route, { path: 'login' })
        )
      })(_redux.createStore)(reducer);

      store.dispatch(_.push({ pathname: '/parent/child/123', query: { key: 'value' } }));
      expect(store.getState().router.location.pathname).to.equal('/login');
    });

    describe('isActive', function () {
      it('creates a selector for whether a pathname/query pair is active', function () {
        var reducer = _redux.combineReducers({
          router: _.routerStateReducer
        });

        var history = _historyLibCreateMemoryHistory2['default']();

        var store = _.reduxReactRouter({
          history: history,
          routes: routes
        })(_redux.createStore)(reducer);

        var activeSelector = _.isActive('/parent', { key: 'value' });
        expect(activeSelector(store.getState().router)).to.be['false'];
        store.dispatch(_.push({ pathname: '/parent', query: { key: 'value' } }));
        expect(activeSelector(store.getState().router)).to.be['true'];
      });
    });
  });
});