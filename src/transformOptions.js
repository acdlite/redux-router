import { createRoutes } from 'react-router';

const defaults = {
  onError: error => { throw error; },
  routerStateSelector: state => state.router
};

export default function transformOptions(next) {
  return options => createStore => (reducer, initialState) => {
    const {
      routes: baseRoutes,
      getRoutes,
      createHistory: baseCreateHistory,
      history: baseHistory
    } = options;

    const createHistory = !baseCreateHistory && baseHistory
      ? () => baseHistory
      : null;

    let store;

    function dispatch(action) {
      return store.dispatch(action);
    }

    function getState() {
      return store.getState();
    }

    const routes = typeof getRoutes === 'function'
      ? getRoutes(dispatch, getState)
      : baseRoutes;

    store = next({
      ...defaults,
      ...options,
      routes: createRoutes(routes),
      createHistory
    })(createStore)(reducer, initialState);

    return store;
  };
}
