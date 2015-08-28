'use strict';

exports.__esModule = true;

/**
 * Reducer of LOCATION_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */
exports['default'] = routerStateReducer;

var _LOCATION_DID_CHANGE = require('./actionTypes');

function routerStateReducer(_x, action) {
  var state = arguments[0] === undefined ? {} : arguments[0];

  return action.type === _LOCATION_DID_CHANGE.LOCATION_DID_CHANGE ? action.payload : state;
}

module.exports = exports['default'];