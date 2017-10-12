'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = useDefaults;
var defaults = {
  onError: function onError(error) {
    throw error;
  },
  routerStateSelector: function routerStateSelector(state) {
    return state.router;
  }
};

function useDefaults(next) {
  return function (options) {
    return function (createStore) {
      return function (reducer, initialState) {
        var optionsWithDefaults = _extends({}, defaults, options);

        var baseCreateHistory = optionsWithDefaults.createHistory;
        var baseHistory = optionsWithDefaults.history;

        var createHistory = undefined;
        if (typeof baseCreateHistory === 'function') {
          createHistory = baseCreateHistory;
        } else if (baseHistory) {
          createHistory = function () {
            return baseHistory;
          };
        } else {
          createHistory = null;
        }

        return next(_extends({}, optionsWithDefaults, {
          createHistory: createHistory
        }))(createStore)(reducer, initialState);
      };
    };
  };
}

module.exports = exports['default'];