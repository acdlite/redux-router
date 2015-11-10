import { applyMiddleware } from 'redux';
import { useRoutes } from 'react-router';
import historyMiddleware from './historyMiddleware';
import { ROUTER_STATE_SELECTOR } from './constants';

export default function reduxReactRouter({
  routes,
  createHistory,
  parseQueryString,
  stringifyQuery,
  routerStateSelector
}) {
  return createStore => (reducer, initialState) => {

    let baseCreateHistory;
    if (typeof createHistory === 'function') {
      baseCreateHistory = createHistory;
    } else if (createHistory) {
      baseCreateHistory = () => createHistory;
    }

    const history = useRoutes(baseCreateHistory)({
      routes,
      parseQueryString,
      stringifyQuery
    });

    const store =
      applyMiddleware(
        historyMiddleware(history)
      )(createStore)(reducer, initialState);

    store.history = history;
    store[ROUTER_STATE_SELECTOR] = routerStateSelector;

    return store;
  };
}
