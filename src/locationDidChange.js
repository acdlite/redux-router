import { LOCATION_DID_CHANGE } from './actionTypes';

/**
 * Action creator for signaling that the router has changed.
 * @private
 * @param  {Location} location - Location object
 * @param  {Object} params - Route params
 * @return {Action} Action object
 */
export default function locationDidChange(location, params) {
  return {
    type: LOCATION_DID_CHANGE,
    payload: {
      pathname: location.pathname,
      query: location.query,
      navigationType: location.navigationType,
      state: location.state,
      params
    }
  };
}
