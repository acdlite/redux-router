import { applyMiddleware, compose } from 'redux';
import { createRoutes } from 'react-router';
import replaceRoutesMiddleware from './replaceRoutesMiddleware';

export default function routeReplacement(next) {
  return options => createStore => (reducer, initialState) => {
    const {
      routes: baseRoutes,
      getRoutes,
      routerStateSelector
    } = options;

    let store;

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

    let routes;
    if (baseRoutes) {
      routes = baseRoutes;
    } else if (getRoutes) {
      routes = getRoutes({
        dispatch: action => store.dispatch(action),
        getState: () => store.getState()
      });
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

    store = compose(
      applyMiddleware(
        replaceRoutesMiddleware(replaceRoutes)
      ),
      next({
        ...options,
        routes: createRoutes(routes)
      })
    )(createStore)(reducer, initialState);

    return store;
  };
}
