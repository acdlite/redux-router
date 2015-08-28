'use strict';

exports.__esModule = true;

/**
 * Action creator for triggering a router url replacement. Accepts a payload which is
 * either a pathname or an object with { pathname, query, params, state },
 * corresponding to the params of router.replaceWith().
 * @param  {String|Object} payload - Pathname or object
 * @return {Object} Action object
 */
exports['default'] = replaceWith;

var _REPLACE_WITH = require('./actionTypes');

function replaceWith(pathname, query, state) {
  return {
    type: _REPLACE_WITH.REPLACE_WITH,
    payload: { pathname: pathname, query: query, state: state }
  };
}

module.exports = exports['default'];