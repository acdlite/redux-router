import { ROUTER_DID_CHANGE } from './constants';

/**
 * Action creator for signaling that the router has changed.
 * @private
 * @param  {RouterState} state - New router state
 * @return {Action} Action object
 */
export default function routerDidChange(state) {
  return {
    type: ROUTER_DID_CHANGE,
    payload: state
  };
}
