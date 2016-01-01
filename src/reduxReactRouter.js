import { applyMiddleware } from 'redux';
import { useRouterHistory, createRoutes } from 'react-router';
import { hashHistory } from 'react-router'
import createTransitionManager from 'react-router/lib/createTransitionManager' ;
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

    const createAppHistory = useRouterHistory(baseCreateHistory);

    const history = createAppHistory({
      parseQueryString,
      stringifyQueryString: stringifyQuery,
    });

    [ 'pushState', 'push', 'replaceState', 'replace',
      'setState', 'go', 'goBack', 'goForward',
      'listen', 'createLocation', 'match' ].forEach(funcName => {
      if (!history.hasOwnProperty(funcName) &&
          typeof(history[funcName]) === 'function') {
        throw new Error(`History API does not support function: ${funcName}`);
      }
    });

    const transitionManager = createTransitionManager(
        history, createRoutes(routes || children)
    );

    const store =
      applyMiddleware(
        historyMiddleware(history)
      )(createStore)(reducer, initialState);

    store.transitionManager = transitionManager;
    store.history = history;
    store[ROUTER_STATE_SELECTOR] = routerStateSelector;

    return store;
  };
}
