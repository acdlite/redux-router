'use strict';

exports.__esModule = true;
exports['default'] = isActive;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sigfoxReactRouterLibIsActive = require('@sigfox/react-router/lib/isActive');

var _sigfoxReactRouterLibIsActive2 = _interopRequireDefault(_sigfoxReactRouterLibIsActive);

/**
 * Creates a router state selector that returns whether or not the given
 * pathname and query are active.
 * @param {String} pathname
 * @param {Object} query
 * @param {Boolean} indexOnly
 * @return {Boolean}
 */

function isActive(pathname, query) {
  var indexOnly = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  return function (state) {
    if (!state) return false;
    var location = state.location;
    var params = state.params;
    var routes = state.routes;

    return _sigfoxReactRouterLibIsActive2['default']({ pathname: pathname, query: query }, indexOnly, location, routes, params);
  };
}

module.exports = exports['default'];