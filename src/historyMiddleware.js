import { HISTORY_API } from './constants';

/**
 * Middleware for interacting with the history API
 * @param {History} History object
 */
export default function historyMiddleware(history) {
  return () => next => action => {
    if (action.type === HISTORY_API) {
      const { method, args } = action.payload;
      return history[method](...args);
    }
    return next(action);
  };
}
