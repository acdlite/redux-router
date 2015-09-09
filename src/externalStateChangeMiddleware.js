import { ROUTER_DID_CHANGE } from './constants';
import replaceState from './replaceState';
import routerStateEquals from './routerStateEquals';

export default function externalStateChangeMiddleware(routerStateSelector) {
  return ({ getState, dispatch }) => next => action => {
    if (action.type === ROUTER_DID_CHANGE) {
      return next(action);
    }

    const prevRouterState = routerStateSelector(getState());
    const result = next(action);
    const nextRouterState = routerStateSelector(getState());

    if (
      nextRouterState &&
      !routerStateEquals(prevRouterState, nextRouterState)
    ) {
      const { state, pathname, query } = nextRouterState.location;
      dispatch(replaceState(state, pathname, query));
    }

    return result;
  };
}
