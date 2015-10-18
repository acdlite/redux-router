import { compose } from 'redux';
import { routerDidChange } from './actionCreators';
import routerStateEquals from './routerStateEquals';
import reduxReactRouter from './reduxReactRouter';
import useDefaults from './useDefaults';
import routeReplacement from './routeReplacement';

function historySynchronization(next) {
  return options => createStore => (reducer, initialState) => {
    const { onError, routerStateSelector } = options;
    const store = next(options)(createStore)(reducer, initialState);
    const { history } = store;

    let routerState;

    history.listen((error, nextRouterState) => {
      if (error) {
        onError(error);
        return;
      }

      if (!routerStateEquals(routerState, nextRouterState)) {
        routerState = nextRouterState;
        store.dispatch(routerDidChange(nextRouterState));
      }
    });

    store.subscribe(() => {
      const nextRouterState = routerStateSelector(store.getState());
      const currentRouterState = routerState;
      routerState = nextRouterState;

      if (
        nextRouterState &&
        !routerStateEquals(currentRouterState, nextRouterState)
      ) {
        const { state, pathname, query } = nextRouterState.location;
        history.replaceState(state, pathname, query);
      }
    });

    return store;
  };
}

export default compose(
  useDefaults,
  routeReplacement,
  historySynchronization
)(reduxReactRouter);
