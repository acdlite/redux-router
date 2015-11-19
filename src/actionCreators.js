import { ROUTER_DID_CHANGE, INIT_ROUTES, REPLACE_ROUTES, HISTORY_API } from './constants';

/**
 * Action creator for signaling that the router has changed.
 * @private
 * @param  {RouterState} state - New router state
 * @return {Action} Action object
 */
export function routerDidChange(state) {
  return {
    type: ROUTER_DID_CHANGE,
    payload: state
  };
}

/**
 * Action creator that initiates route config
 * @private
 * @param {Array<Route>|ReactElement} routes - New routes
 */
export function initRoutes(routes) {
  return {
    type: INIT_ROUTES,
    payload: routes
  };
}

/**
 * Action creator that replaces the current route config
 * @private
 * @param {Array<Route>|ReactElement} routes - New routes
 */
export function replaceRoutes(routes) {
  return {
    type: REPLACE_ROUTES,
    payload: routes
  };
}

/**
 * Creates an action creator for calling a history API method.
 * @param {string} method - Name of method
 * @returns {ActionCreator} Action creator with same parameters as corresponding
 * history method
 */
export function historyAPI(method) {
  return (...args) => ({
    type: HISTORY_API,
    payload: {
      method,
      args
    }
  });
}

export const pushState = historyAPI('pushState');
export const push = historyAPI('push');
export const replaceState = historyAPI('replaceState');
export const replace = historyAPI('replace');
export const setState = historyAPI('setState');
export const go = historyAPI('go');
export const goBack = historyAPI('goBack');
export const goForward = historyAPI('goForward');
