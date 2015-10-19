import { compose } from 'redux';
import { routerDidChange } from './actionCreators';
import routerStateEquals from './routerStateEquals';
import reduxReactRouter from './reduxReactRouter';
import useDefaults from './useDefaults';
import routeReplacement from './routeReplacement';
import toPlainObject from './toPlainObject';

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

      const prevRouterState = routerStateSelector(toPlainObject(store.getState()));

      if (!routerStateEquals(prevRouterState, nextRouterState)) {
        store.dispatch(routerDidChange(nextRouterState));
      }
    });

    store.subscribe(() => {
      const nextRouterState = routerStateSelector(toPlainObject(store.getState()));

      if (
        nextRouterState &&
        !routerStateEquals(routerState, nextRouterState)
      ) {
        const { state, pathname, query } = nextRouterState.location;
        history.replaceState(state, pathname, query);
      }

      routerState = nextRouterState;
    });

    return store;
  };
}

export default compose(
  useDefaults,
  routeReplacement,
  historySynchronization
)(reduxReactRouter);
