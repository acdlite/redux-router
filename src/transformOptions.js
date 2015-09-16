import { applyMiddleware, compose } from 'redux';
import { createRoutes } from 'react-router';
import replaceRoutesMiddleware from './replaceRoutesMiddleware';

const defaults = {
  onError: error => { throw error; },
  routerStateSelector: state => state.router
};

export default function transformOptions(next) {
  return options => createStore => (reducer, initialState) => {
    const {
      routes: baseRoutes,
      createHistory: baseCreateHistory,
      history: baseHistory,
      routerStateSelector
    } = { ...defaults, ...options };

    let store;

    const createHistory = !baseCreateHistory && baseHistory
      ? () => baseHistory
      : null;

    let childRoutes = [];
    let areChildRoutesResolved = false;
    const childRoutesCallbacks = [];

    function replaceRoutes(r) {
      childRoutes = createRoutes(r);

      const routerState = routerStateSelector(store.getState());
      if (routerState) {
        const { state, pathname, query } = routerState.location;
        store.history.replaceState(state, pathname, query);
      }

      if (!areChildRoutesResolved) {
        areChildRoutesResolved = true;
        childRoutesCallbacks.forEach(cb => cb(null, childRoutes));
      }
    }

    const routes = baseRoutes
      ? baseRoutes
      : [{
        getChildRoutes: (location, cb) => {
          if (!areChildRoutesResolved) {
            childRoutesCallbacks.push(cb);
            return;
          }

          cb(null, childRoutes);
        }
      }];

    store = compose(
      applyMiddleware(
        replaceRoutesMiddleware(replaceRoutes)
      ),
      next({
        ...defaults,
        ...options,
        routes: createRoutes(routes),
        createHistory
      })
    )(createStore)(reducer, initialState);

    return store;
  };
}
