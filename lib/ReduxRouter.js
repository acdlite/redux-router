'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _reactRouterLibRouterUtils = require('react-router/lib/RouterUtils');

var _routerStateEquals = require('./routerStateEquals');

var _routerStateEquals2 = _interopRequireDefault(_routerStateEquals);

var _constants = require('./constants');

var _actionCreators = require('./actionCreators');

function memoizeRouterStateSelector(selector) {
  var previousRouterState = null;

  return function (state) {
    var nextRouterState = selector(state);
    if (_routerStateEquals2['default'](previousRouterState, nextRouterState)) {
      return previousRouterState;
    }
    previousRouterState = nextRouterState;
    return nextRouterState;
  };
}

function getRoutesFromProps(props) {
  return props.routes || props.children;
}

var ReduxRouter = (function (_Component) {
  _inherits(ReduxRouter, _Component);

  _createClass(ReduxRouter, null, [{
    key: 'propTypes',
    value: {
      children: _propTypes2['default'].node
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      store: _propTypes2['default'].object
    },
    enumerable: true
  }]);

  function ReduxRouter(props, context) {
    _classCallCheck(this, ReduxRouter);

    _Component.call(this, props, context);
    this.router = _reactRouterLibRouterUtils.createRouterObject(context.store.history, context.store.transitionManager);
  }

  ReduxRouter.prototype.componentWillMount = function componentWillMount() {
    this.context.store.dispatch(_actionCreators.initRoutes(getRoutesFromProps(this.props)));
  };

  ReduxRouter.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.receiveRoutes(getRoutesFromProps(nextProps));
  };

  ReduxRouter.prototype.receiveRoutes = function receiveRoutes(routes) {
    if (!routes) return;

    var store = this.context.store;

    store.dispatch(_actionCreators.replaceRoutes(routes));
  };

  ReduxRouter.prototype.render = function render() {
    var store = this.context.store;

    if (!store) {
      throw new Error('Redux store missing from context of <ReduxRouter>. Make sure you\'re ' + 'using a <Provider>');
    }

    var history = store.history;
    var routerStateSelector = store[_constants.ROUTER_STATE_SELECTOR];

    if (!history || !routerStateSelector) {
      throw new Error('Redux store not configured properly for <ReduxRouter>. Make sure ' + 'you\'re using the reduxReactRouter() store enhancer.');
    }

    return _react2['default'].createElement(ReduxRouterContext, _extends({
      history: history,
      routerStateSelector: memoizeRouterStateSelector(routerStateSelector),
      router: this.router
    }, this.props));
  };

  return ReduxRouter;
})(_react.Component);

var ReduxRouterContext = (function (_Component2) {
  _inherits(ReduxRouterContext, _Component2);

  function ReduxRouterContext() {
    _classCallCheck(this, _ReduxRouterContext);

    _Component2.apply(this, arguments);
  }

  ReduxRouterContext.prototype.render = function render() {
    var location = this.props.location;

    if (location === null || location === undefined) {
      return null; // Async matching
    }

    var RoutingContext = this.props.RoutingContext || _reactRouter.RouterContext;

    return _react2['default'].createElement(RoutingContext, this.props);
  };

  _createClass(ReduxRouterContext, null, [{
    key: 'propTypes',
    value: {
      location: _propTypes2['default'].object,
      RoutingContext: _propTypes2['default'].func
    },
    enumerable: true
  }]);

  var _ReduxRouterContext = ReduxRouterContext;
  ReduxRouterContext = _reactRedux.connect(function (state, _ref) {
    var routerStateSelector = _ref.routerStateSelector;
    return routerStateSelector(state) || {};
  })(ReduxRouterContext) || ReduxRouterContext;
  return ReduxRouterContext;
})(_react.Component);

exports['default'] = ReduxRouter;
module.exports = exports['default'];