import { LOCATION_DID_CHANGE, TRANSITION_TO } from './actionTypes';

/**
 * Reducer of LOCATION_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */
export default function routerStateReducer(state = {}, action) {
  return [LOCATION_DID_CHANGE, TRANSITION_TO].indexOf(action.type) !== -1
    ? action.payload
    : state;
}
