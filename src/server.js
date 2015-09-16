import { compose, applyMiddleware } from 'redux';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import baseReduxReactRouter from './reduxReactRouter';
import useDefaults from './useDefaults';
import routeReplacement from './routeReplacement';
import matchMiddleware from './matchMiddleware';
import { MATCH } from './constants';

function server(next) {
  return options => createStore => (reducer, initialState) => {
    const store = compose(
      applyMiddleware(
        matchMiddleware((...args) => store.history.match(...args))
      ),
      next({
        ...options,
        createHistory: options.createHistory || createMemoryHistory
      })
    )(createStore)(reducer, initialState);
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
  useDefaults,
  routeReplacement,
  server
)(baseReduxReactRouter);
