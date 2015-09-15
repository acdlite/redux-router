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

    let childRoutes = [];
    let areChildRoutesResolved = false;
    const childRoutesCallbacks = [];

    function replaceRoutes(r) {
      childRoutes = createRoutes(r);

      if (!areChildRoutesResolved) {
        areChildRoutesResolved = true;
        childRoutesCallbacks.forEach(cb => cb(null, childRoutes));
      }
    }

    let routes;
    if (typeof getRoutes === 'function') {
      routes = getRoutes(dispatch, getState);
    } else if (baseRoutes) {
      routes = baseRoutes;
    } else {
      routes = [{
        getChildRoutes: (location, cb) => {
          if (!areChildRoutesResolved) {
            childRoutesCallbacks.push(cb);
            return;
          }

          cb(null, childRoutes);
        }
      }];
    }

    store =  compose(
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
