import {
  ROUTER_DID_CHANGE,
  REPLACE_ROUTES,
  DOES_NEED_REFRESH
} from './constants';

/**
 * Reducer of ROUTER_DID_CHANGE actions. Returns a state object
 * with { pathname, query, params, navigationType }
 * @param  {Object} state - Previous state
 * @param  {Object} action - Action
 * @return {Object} New state
 */
export default function routerStateReducer(state = null, action) {
  switch (action.type) {
  case ROUTER_DID_CHANGE:
    return action.payload;
  case REPLACE_ROUTES:
    if (!state) return state;
    return {
      ...state,
      [DOES_NEED_REFRESH]: true
    };
  default:
    return state;
  }
}
