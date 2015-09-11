import historyMiddleware from './historyMiddleware';
import externalStateChangeMiddleware from './externalStateChangeMiddleware';
import routerDidChange from './routerDidChange';
import routerStateEquals from './routerStateEquals';
import { applyMiddleware } from 'redux';
import { useRoutes, createRoutes } from 'react-router';
import { ROUTER_STATE_SELECTOR } from './constants';

const defaults = {
  onError: error => { throw error; },
  routerStateSelector: state => state.router
};

export default function reduxReactRouter(options) {
  return createStore => (reducer, initialState) => {
    const {
      routes: baseRoutes,
      getRoutes,
      history: baseHistory,
      createHistory: baseCreateHistory,
      parseQueryString,
      stringifyQuery,
      onError,
      routerStateSelector
    } = { ...defaults, ...options };

    let store;

    function dispatch(action) {
      if (store) return store.dispatch(action);
    }

    function getState() {
      if (store) return store.getState();
    }

    const routes = typeof getRoutes === 'function'
      ? getRoutes(dispatch, getState)
      : baseRoutes;
    const createHistory = baseCreateHistory || (() => baseHistory);
    const history = useRoutes(createHistory)({
      routes: createRoutes(routes),
      parseQueryString,
      stringifyQuery
    });

    store =
      applyMiddleware(
        historyMiddleware(history),
        externalStateChangeMiddleware(routerStateSelector)
      )(createStore)(reducer, initialState);

    store.history = history;
    store[ROUTER_STATE_SELECTOR] = routerStateSelector;

    history.listen((error, nextRouterState) => {
      if (error) {
        onError(error);
        return;
      }

      const prevRouterState = routerStateSelector(store.getState());

      if (!routerStateEquals(prevRouterState, nextRouterState)) {
        store.dispatch(routerDidChange(nextRouterState));
      }
    });

    return store;
  };
}
