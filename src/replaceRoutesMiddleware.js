import { INIT_ROUTES, REPLACE_ROUTES } from './constants';

export default function replaceRoutesMiddleware(replaceRoutes) {
  return () => next => action => {
    const isInitRoutes = action.type === INIT_ROUTES;
    if (isInitRoutes || action.type === REPLACE_ROUTES) {
      replaceRoutes(action.payload, isInitRoutes);
    }
    return next(action);
  };
}
