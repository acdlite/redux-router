'use strict';

exports.__esModule = true;
exports['default'] = routerStateEquals;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _constants = require('./constants');

/**
 * Check if two router states are equal. Ignores `location.key`.
 * @returns {Boolean}
 */

function routerStateEquals(a, b) {
  if (!a && !b) return true;
  if (a && !b || !a && b) return false;
  if (a[_constants.DOES_NEED_REFRESH] || b[_constants.DOES_NEED_REFRESH]) return false;

  return a.location.pathname === b.location.pathname && a.location.search === b.location.search && _deepEqual2['default'](a.location.state, b.location.state);
}

module.exports = exports['default'];