'use strict';

exports.__esModule = true;

/**
 * Action creator for triggering a router transition. Accepts a payload which is
 * either a pathname or an object with { pathname, query, params, state },
 * corresponding to the params of router.transitionTo().
 * @param  {String|Object} payload - Pathname or object
 * @return {Object} Action object
 */
exports['default'] = transitionTo;

var _TRANSITION_TO = require('./actionTypes');

function transitionTo(pathname, query, state) {
  return {
    type: _TRANSITION_TO.TRANSITION_TO,
    payload: { pathname: pathname, query: query, state: state }
  };
}

module.exports = exports['default'];