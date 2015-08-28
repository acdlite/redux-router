'use strict';

exports.__esModule = true;

/**
 * Action creator for signaling that the router has changed.
 * @private
 * @param  {Location} location - Location object
 * @param  {Object} params - Route params
 * @return {Action} Action object
 */
exports['default'] = locationDidChange;

var _LOCATION_DID_CHANGE = require('./actionTypes');

function locationDidChange(location, params) {
  return {
    type: _LOCATION_DID_CHANGE.LOCATION_DID_CHANGE,
    payload: {
      pathname: location.pathname,
      query: location.query,
      navigationType: location.navigationType,
      state: location.state,
      params: params
    }
  };
}

module.exports = exports['default'];