import { LOCATION_DID_CHANGE } from './actionTypes';

/**
 * Reducer of LOCATION_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */
export default function routerStateReducer(state = {}, action) {
  return action.type === LOCATION_DID_CHANGE
    ? action.payload
    : state;
}
