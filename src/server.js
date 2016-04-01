import { compose, applyMiddleware } from 'redux';
import baseReduxReactRouter from './reduxReactRouter';
import useDefaults from './useDefaults';
import routeReplacement from './routeReplacement';
import matchMiddleware from './matchMiddleware';
import { MATCH } from './constants';

function serverInvariants(next) {
  return options => createStore => {
    if (!options || !(options.routes || options.getRoutes)) {
      throw new Error(
        'When rendering on the server, routes must be passed to the '
      + 'reduxReactRouter() store enhancer; routes as a prop or as children of '
      + '<ReduxRouter> is not supported. To deal with circular dependencies '
      + 'between routes and the store, use the option getRoutes(store).'
      );
    }
    if (!options || !(options.createHistory)) {
      throw new Error(
          'When rendering on the server, createHistory must be passed to the '
          + 'reduxReactRouter() store enhancer'
      );
    }

    return next(options)(createStore);
  };
}

function matching(next) {
  return options => createStore => (reducer, initialState) => {
    const store = compose(
      applyMiddleware(
        matchMiddleware((url, callback) => {
          const location = store.history.createLocation(url);

          store.transitionManager.match(location, callback);
        })
      ),
      next(options))(createStore)(reducer, initialState);
    return store;
  };
}

export function match(url, callback) {
  return {
    type: MATCH,
    payload: {
      url,
      callback
    }
  };
}

export const reduxReactRouter = compose(
  serverInvariants,
  useDefaults,
  routeReplacement,
  matching
)(baseReduxReactRouter);
