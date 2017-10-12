'use strict';

exports.__esModule = true;
exports.match = match;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reduxReactRouter = require('./reduxReactRouter');

var _reduxReactRouter2 = _interopRequireDefault(_reduxReactRouter);

var _useDefaults = require('./useDefaults');

var _useDefaults2 = _interopRequireDefault(_useDefaults);

var _routeReplacement = require('./routeReplacement');

var _routeReplacement2 = _interopRequireDefault(_routeReplacement);

var _matchMiddleware = require('./matchMiddleware');

var _matchMiddleware2 = _interopRequireDefault(_matchMiddleware);

var _constants = require('./constants');

function serverInvariants(next) {
  return function (options) {
    return function (createStore) {
      if (!options || !(options.routes || options.getRoutes)) {
        throw new Error('When rendering on the server, routes must be passed to the ' + 'reduxReactRouter() store enhancer; routes as a prop or as children of ' + '<ReduxRouter> is not supported. To deal with circular dependencies ' + 'between routes and the store, use the option getRoutes(store).');
      }
      if (!options || !options.createHistory) {
        throw new Error('When rendering on the server, createHistory must be passed to the ' + 'reduxReactRouter() store enhancer');
      }

      return next(options)(createStore);
    };
  };
}

function matching(next) {
  return function (options) {
    return function (createStore) {
      return function (reducer, initialState) {
        var store = _redux.compose(_redux.applyMiddleware(_matchMiddleware2['default'](function (url, callback) {
          var location = store.history.createLocation(url);

          store.transitionManager.match(location, callback);
        })), next(options))(createStore)(reducer, initialState);
        return store;
      };
    };
  };
}

function match(url, callback) {
  return {
    type: _constants.MATCH,
    payload: {
      url: url,
      callback: callback
    }
  };
}

var reduxReactRouter = _redux.compose(serverInvariants, _useDefaults2['default'], _routeReplacement2['default'], matching)(_reduxReactRouter2['default']);
exports.reduxReactRouter = reduxReactRouter;