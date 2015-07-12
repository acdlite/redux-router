import { TRANSITION_TO } from './actionTypes';

/**
 * Action creator for triggering a router transition. Accepts a payload which is
 * either a pathname or an object with { pathname, query, params, state },
 * corresponding to the params of router.transitionTo().
 * @param  {String|Object} payload - Pathname or object
 * @return {Object} Action object
 */
export default function transitionTo(payload) {
  return {
    type: TRANSITION_TO,
    payload: typeof payload === 'string'
      ? { pathname: payload }
      : payload || {}
  };
}
