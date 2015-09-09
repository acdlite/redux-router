import { PUSH_STATE, REPLACE_STATE } from './constants';

/**
 * Middleware for intercepting actions with type TRANSITION_TO and initiating
 * a transition.
 * @param {Router} Router instance
 */
export default function historyMiddleware(history) {
  return () => next => action => {
    switch (action.type) {
    case PUSH_STATE:
      history.pushState(...action.payload);
      break;
    case REPLACE_STATE:
      history.replaceState(...action.payload);
      break;
    default:
      return next(action);
    }
  };
}
