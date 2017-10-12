'use strict';

exports.__esModule = true;
exports['default'] = matchMiddleware;

var _actionCreators = require('./actionCreators');

var _constants = require('./constants');

function matchMiddleware(match) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        if (action.type === _constants.MATCH) {
          (function () {
            var _action$payload = action.payload;
            var url = _action$payload.url;
            var callback = _action$payload.callback;

            match(url, function (error, redirectLocation, routerState) {
              if (!error && !redirectLocation && routerState) {
                dispatch(_actionCreators.routerDidChange(routerState));
              }
              callback(error, redirectLocation, routerState);
            });
          })();
        }
        return next(action);
      };
    };
  };
}

module.exports = exports['default'];