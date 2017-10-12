'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = routerStateReducer;

var _constants = require('./constants');

/**
 * Reducer of ROUTER_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */

function routerStateReducer(state, action) {
  if (state === undefined) state = null;

  var _extends2;

  switch (action.type) {
    case _constants.ROUTER_DID_CHANGE:
      return action.payload;
    case _constants.REPLACE_ROUTES:
      if (!state) return state;
      return _extends({}, state, (_extends2 = {}, _extends2[_constants.DOES_NEED_REFRESH] = true, _extends2));
    default:
      return state;
  }
}

module.exports = exports['default'];