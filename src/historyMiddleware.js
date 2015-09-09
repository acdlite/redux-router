import { PUSH_STATE, REPLACE_STATE } from './constants';

/**
 * Middleware for intercepting actions with type TRANSITION_TO and initiating
 * a transition.
 * @param {Router} Router instance
 */
export default function historyMiddleware(history) {
  return () => next => action => {
    const { state, pathname, query } = action.payload;
    switch (action.type) {
    case PUSH_STATE:
      history.pushState(state, pathname, query);
      break;
    case REPLACE_STATE:
      history.replaceState(state, pathname, query);
      break;
    default:
      return next(action);
    }
  };
}
