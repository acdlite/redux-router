'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
exports.routerMiddleware = routerMiddleware;

/**
 * Creates a component to be used as the `component` prop of a <Route />. Also
 * adds the store to context, serving as a replacement for <Provider />
 * @param  {Object} store - Redux store
 * @return {Component}
 */
exports['default'] = reduxRouteComponent;

var _Component$PropTypes = require('react');

var _TRANSITION_TO$REPLACE_WITH = require('./actionTypes');

var _locationDidChange = require('./locationDidChange');

var _locationDidChange2 = _interopRequireWildcard(_locationDidChange);

var _locationStateEquals = require('./locationStateEquals');

var _locationStateEquals2 = _interopRequireWildcard(_locationStateEquals);

/**
 * Middleware for intercepting actions with type TRANSITION_TO and initiating
 * a transition.
 * @param {Router} Router instance
 */
var router = null;

function routerMiddleware() {
  return function (next) {
    return function (action) {
      if (action.type === _TRANSITION_TO$REPLACE_WITH.TRANSITION_TO) {
        var _action$payload = action.payload;
        var pathname = _action$payload.pathname;
        var query = _action$payload.query;
        var state = _action$payload.state;

        router.transitionTo(pathname, query, state);
      } else if (action.type === _TRANSITION_TO$REPLACE_WITH.REPLACE_WITH) {
        var _action$payload2 = action.payload;
        var pathname = _action$payload2.pathname;
        var query = _action$payload2.query;
        var state = _action$payload2.state;

        router.replaceWith(pathname, query, state);
      } else {
        return next(action);
      }
    };
  };
}

function reduxRouteComponent(s) {
  return (function (_Component) {
    function ReduxRoute(props, context) {
      var _this = this;

      _classCallCheck(this, ReduxRoute);

      _Component.call(this, props, context);
      router = this.context.router;
      var dispatch = s.dispatch;
      var store = _extends({}, s, { dispatch: dispatch });
      this.state = { store: store };
      this.unsubscribe = store.subscribe(function () {
        return _this.onStateChange();
      });
      this.onLocationChange(props, this.state, context);
    }

    _inherits(ReduxRoute, _Component);

    ReduxRoute.prototype.getChildContext = function getChildContext() {
      return { store: this.state.store };
    };

    ReduxRoute.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
      this.onLocationChange(props);
    };

    ReduxRoute.prototype.storeIsInSyncWithRouter = function storeIsInSyncWithRouter() {
      var state = arguments[0] === undefined ? this.state : arguments[0];
      var context = arguments[1] === undefined ? this.context : arguments[1];

      var storeState = state.store.getState();
      var storeLocationState = storeState.router.state;
      var routerLocationState = context.router.state.location.state; // LOL
      return _locationStateEquals2['default'](storeLocationState, routerLocationState);
    };

    /**
     * Update store state in response to router change
     */

    ReduxRoute.prototype.onLocationChange = function onLocationChange() {
      var props = arguments[0] === undefined ? this.props : arguments[0];
      var state = arguments[1] === undefined ? this.state : arguments[1];
      var context = arguments[2] === undefined ? this.context : arguments[2];
      var location = props.location;
      var params = props.params;
      var dispatch = state.store.dispatch;

      if (!this.storeIsInSyncWithRouter(state, context)) {
        dispatch(_locationDidChange2['default'](location, params));
      }
    };

    /**
     * Trigger transition in response to store change from external source —
     * such as devtools or deserialization — by comparing location.state.key
     */

    ReduxRoute.prototype.onStateChange = function onStateChange() {
      var storeState = this.state.store.getState();

      // Exit early if route state does not exist
      if (!storeState.router) {
        console.warn('No router state was found at state.router. Ensure that the Redux ' + 'reducer has been property configured using routerStateReducer()');
        return;
      }

      if (!this.storeIsInSyncWithRouter()) {
        var _storeState$router = storeState.router;
        var pathname = _storeState$router.pathname;
        var query = _storeState$router.query;
        var state = _storeState$router.state;

        // Check that pathname is defined
        if (pathname) {
          this.context.router.transitionTo(pathname, query, state);
        }
      }
    };

    ReduxRoute.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unsubscribe();
    };

    ReduxRoute.prototype.render = function render() {
      return this.props.children;
    };

    _createClass(ReduxRoute, null, [{
      key: 'contextTypes',
      enumerable: true,
      value: {
        router: _Component$PropTypes.PropTypes.object
      }
    }, {
      key: 'childContextTypes',
      enumerable: true,
      value: {
        store: _Component$PropTypes.PropTypes.object
      }
    }]);

    return ReduxRoute;
  })(_Component$PropTypes.Component);
}