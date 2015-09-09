'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _transitionTo$replaceWith$routerStateReducer$reduxRouteComponent = require('../');

var _LOCATION_DID_CHANGE = require('../actionTypes');

var _createStore = require('redux');

var _Connector = require('redux/react');

var _jsdom = require('./jsdom');

var _jsdom2 = _interopRequireWildcard(_jsdom);

var _React$Component$addons = require('react/addons');

var _React$Component$addons2 = _interopRequireWildcard(_React$Component$addons);

var _Router$Route = require('react-router');

var _MemoryHistory = require('react-router/lib/MemoryHistory');

var _MemoryHistory2 = _interopRequireWildcard(_MemoryHistory);

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

var TestUtils = _React$Component$addons.addons.TestUtils;

describe('reduxRouteComponent', function () {
  _jsdom2['default']();

  function externalStateChange() {
    return {
      type: _LOCATION_DID_CHANGE.LOCATION_DID_CHANGE,
      payload: {
        pathname: '/two/special-something',
        query: {
          baz: 'foo'
        },
        state: {
          key: 'q7ugo9odofq7iudi'
        },
        params: {
          extra: 'special-something'
        }
      }
    };
  }

  it('responds to route changes', function (done) {
    var App = (function (_Component) {
      function App() {
        _classCallCheck(this, App);

        if (_Component != null) {
          _Component.apply(this, arguments);
        }
      }

      _inherits(App, _Component);

      App.prototype.render = function render() {
        return _React$Component$addons2['default'].createElement(
          _Connector.Connector,
          { select: function (s) {
              return s;
            } },
          function (props) {
            return _React$Component$addons2['default'].createElement(Child, _extends({}, props.router, {
              externalStateChange: function () {
                return props.dispatch(externalStateChange());
              },
              transitionTo: function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                return props.dispatch(_transitionTo$replaceWith$routerStateReducer$reduxRouteComponent.transitionTo.apply(undefined, args));
              },
              replaceWith: function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                return props.dispatch(_transitionTo$replaceWith$routerStateReducer$reduxRouteComponent.replaceWith.apply(undefined, args));
              }
            }));
          }
        );
      };

      return App;
    })(_React$Component$addons.Component);

    var Child = (function (_Component2) {
      function Child() {
        _classCallCheck(this, Child);

        if (_Component2 != null) {
          _Component2.apply(this, arguments);
        }
      }

      _inherits(Child, _Component2);

      Child.prototype.render = function render() {
        return _React$Component$addons2['default'].createElement('div', null);
      };

      return Child;
    })(_React$Component$addons.Component);

    var child = undefined;
    var reducerSpy = _sinon2['default'].spy();
    var steps = [function step1() {
      var _this = this;

      setImmediate(function () {
        expect(child.props.pathname).to.equal('/one');
        // Normal React Router transition
        _this.transitionTo('/faketwo');
      });
    }, function step2() {
      var _this2 = this;

      setImmediate(function () {
        expect(child.props.pathname).to.equal('/faketwo');
        // Normal React Router url replacement
        _this2.replaceWith('/two/something?foo=bar');
      });
    }, function step3() {
      expect(child.props.pathname).to.equal('/two/something');
      expect(child.props.params).to.eql({ extra: 'something' });
      expect(child.props.query).to.eql({ foo: 'bar' });
      // Action creator transition
      child.props.transitionTo('/two/somewhat-special?top=kek');
    }, function step4() {
      expect(child.props.pathname).to.equal('/two/somewhat-special');
      expect(child.props.params).to.eql({ extra: 'somewhat-special' });
      expect(child.props.query).to.eql({ top: 'kek' });
      // Action creator replacement
      child.props.replaceWith('/two/something-special?bar=baz');
    }, function step5() {
      expect(child.props.pathname).to.equal('/two/something-special');
      expect(child.props.params).to.eql({ extra: 'something-special' });
      expect(child.props.query).to.eql({ bar: 'baz' });
      // External store state change transition
      // (e.g. devtools, state deserialization)
      child.props.externalStateChange();
    }, function step6() {
      expect(child.props.pathname).to.equal('/two/special-something');
      expect(child.props.params).to.eql({ extra: 'special-something' });
      expect(child.props.query).to.eql({ baz: 'foo' });
      expect(reducerSpy.callCount).to.equal(7);
      done();
    }];

    function execNextStep() {
      steps.shift().apply(this, arguments);
    }

    function reducer(_x, action) {
      var state = arguments[0] === undefined ? {} : arguments[0];

      reducerSpy();
      return {
        router: _transitionTo$replaceWith$routerStateReducer$reduxRouteComponent.routerStateReducer(state, action)
      };
    }

    var store = _createStore.createStore(reducer);

    var tree = TestUtils.renderIntoDocument(_React$Component$addons2['default'].createElement(
      _Router$Route.Router,
      { history: new _MemoryHistory2['default']('/one'), onUpdate: execNextStep },
      _React$Component$addons2['default'].createElement(
        _Router$Route.Route,
        { component: _transitionTo$replaceWith$routerStateReducer$reduxRouteComponent.reduxRouteComponent(store) },
        _React$Component$addons2['default'].createElement(
          _Router$Route.Route,
          { component: App },
          _React$Component$addons2['default'].createElement(_Router$Route.Route, { path: 'one' }),
          _React$Component$addons2['default'].createElement(_Router$Route.Route, { path: 'faketwo' }),
          _React$Component$addons2['default'].createElement(_Router$Route.Route, { path: 'two/:extra' })
        )
      )
    ));

    child = TestUtils.findRenderedComponentWithType(tree, Child);
  });
});