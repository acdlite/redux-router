'use strict';

exports.__esModule = true;
exports['default'] = historyMiddleware;

var _constants = require('./constants');

/**
 * Middleware for interacting with the history API
 * @param {History} History object
 */

function historyMiddleware(history) {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type === _constants.HISTORY_API) {
          var _action$payload = action.payload;
          var method = _action$payload.method;
          var args = _action$payload.args;

          return history[method].apply(history, args);
        }
        return next(action);
      };
    };
  };
}

module.exports = exports['default'];