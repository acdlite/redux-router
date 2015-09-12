import { ROUTER_DID_CHANGE } from './constants';

/**
 * Reducer of ROUTER_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */
export default function routerStateReducer(state = null, action) {
  return action.type === ROUTER_DID_CHANGE
    ? action.payload
    : state;
}
