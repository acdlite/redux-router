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

    [ 'pushState', 'push', 'replaceState', 'replace',
      'setState', 'go', 'goBack', 'goForward',
      'listen', 'createLocation', 'match' ].forEach(funcName => {
        if (!history.hasOwnProperty(funcName)) {
          throw new Error(`History API does not support function: ${funcName}`);
        }
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
