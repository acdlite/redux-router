import { REPLACE_ROUTES } from './constants';

export default function replaceRoutesMiddleware(replaceRoutes) {
  return () => next => action => {
    if (action.type === REPLACE_ROUTES) {
      replaceRoutes(action.payload);
    }
    return next(action);
  };
}
