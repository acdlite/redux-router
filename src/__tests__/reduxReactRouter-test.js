import {
  reduxReactRouter,
  routerStateReducer,
  pushState,
  replaceState,
  isActive
} from '../';

import { createStore, combineReducers } from 'redux';
import React from 'react';
import { Route } from 'react-router';
import createHistory from 'history/lib/createMemoryHistory';
import sinon from 'sinon';

const routes = (
  <Route path="/">
    <Route path="parent">
      <Route path="child/:id"/>
    </Route>
  </Route>
);

describe('reduxRouter()', () => {
  it('adds router state to Redux store', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();

    const store = reduxReactRouter({
      history,
      routes
    })(createStore)(reducer);

    history.pushState(null, '/parent');
    expect(store.getState().router.location.pathname).to.equal('/parent');

    history.pushState(null, '/parent/child/123?key=value');
    expect(store.getState().router.location.pathname)
      .to.equal('/parent/child/123');
    expect(store.getState().router.location.query).to.eql({ key: 'value' });
    expect(store.getState().router.params).to.eql({ id: '123' });
  });

  it('detects external router state changes', () => {
    const baseReducer = combineReducers({
      router: routerStateReducer
    });

    const EXTERNAL_STATE_CHANGE = 'EXTERNAL_STATE_CHANGE';

    const externalState = {
      location: {
        pathname: '/parent/child/123',
        query: { key: 'value' },
        key: 'lolkey'
      }
    };

    const reducerSpy = sinon.spy();
    function reducer(state, action) {
      reducerSpy();

      if (action.type === EXTERNAL_STATE_CHANGE) {
        return { ...state, router: action.payload };
      }

      return baseReducer(state, action);
    }

    const history = createHistory();

    let historyState;
    history.listen(s => historyState = s);

    const store = reduxReactRouter({
      history,
      routes
    })(createStore)(reducer);

    expect(reducerSpy.callCount).to.equal(2);

    store.dispatch({
      type: EXTERNAL_STATE_CHANGE,
      payload: externalState
    });

    expect(reducerSpy.callCount).to.equal(4);
    expect(historyState.pathname).to.equal('/parent/child/123');
    expect(historyState.search).to.equal('?key=value');
  });

  it('works with navigation action creators', () => {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const store = reduxReactRouter({
      createHistory,
      routes
    })(createStore)(reducer);

    store.dispatch(pushState(null, '/parent/child/123', { key: 'value' }));
    expect(store.getState().router.location.pathname)
      .to.equal('/parent/child/123');
    expect(store.getState().router.location.query).to.eql({ key: 'value' });
    expect(store.getState().router.params).to.eql({ id: '123' });

    store.dispatch(replaceState(null, '/parent/child/321', { key: 'value2'}));
    expect(store.getState().router.location.pathname)
      .to.equal('/parent/child/321');
    expect(store.getState().router.location.query).to.eql({ key: 'value2' });
    expect(store.getState().router.params).to.eql({ id: '321' });
  });

  it('doesn\'t interfere with other actions', () => {
    const APPEND_STRING = 'APPEND_STRING';

    function stringBuilderReducer(state = '', action) {
      if (action.type === APPEND_STRING) {
        return state + action.string;
      }
      return state;
    }

    const reducer = combineReducers({
      router: routerStateReducer,
      string: stringBuilderReducer
    });

    const history = createHistory();

    const store = reduxReactRouter({
      history,
      routes
    })(createStore)(reducer);

    store.dispatch({ type: APPEND_STRING, string: 'Uni' });
    store.dispatch({ type: APPEND_STRING, string: 'directional' });
    expect(store.getState().string).to.equal('Unidirectional');
  });

  describe('getRoutes()', () => {
    it('is passed dispatch and getState', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      let store;
      const history = createHistory();

      reduxReactRouter({
        history,
        getRoutes: s => {
          store = s;
          return routes;
        }
      })(createStore)(reducer);

      store.dispatch(pushState(null, '/parent/child/123', { key: 'value' }));
      expect(store.getState().router.location.pathname)
        .to.equal('/parent/child/123');
    });

    it('works with onEnter', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      let store;
      const history = createHistory();

      reduxReactRouter({
        history,
        getRoutes: s => {
          store = s;
          function requireAuth(nextState, redirectTo) {
            if (!s.getState().user) {
              redirectTo(null, '/login');
            }
          }
          return (
            <Route path="/">
              <Route path="login"/>
              <Route path="parent">
                <Route path="child/:id" onEnter={requireAuth}/>
              </Route>
            </Route>
          );
        }
      })(createStore)(reducer);

      store.dispatch(pushState(null, '/parent/child/123', { key: 'value' }));
      expect(store.getState().router.location.pathname)
        .to.equal('/login');
    });
  });

  describe('onEnter hook', () => {
    it('can perform redirects', () => {
      const reducer = combineReducers({
        router: routerStateReducer
      });

      const history = createHistory();

      const requireAuth = (nextState, _replaceState) => {
        _replaceState(null, '/login');
      };

      const store = reduxReactRouter({
        history,
        routes: (
          <Route path="/">
            <Route path="parent">
              <Route path="child/:id" onEnter={requireAuth}/>
            </Route>
            <Route path="login" />
          </Route>
        )
      })(createStore)(reducer);

      store.dispatch(pushState(null, '/parent/child/123', { key: 'value' }));
      expect(store.getState().router.location.pathname)
        .to.equal('/login');
    });

    describe('isActive', () => {
      it('creates a selector for whether a pathname/query pair is active', () => {
        const reducer = combineReducers({
          router: routerStateReducer
        });

        const history = createHistory();

        const store = reduxReactRouter({
          history,
          routes
        })(createStore)(reducer);

        const activeSelector = isActive('/parent', { key: 'value' });
        expect(activeSelector(store.getState().router)).to.be.false;
        history.pushState(null, '/parent?key=value');
        expect(activeSelector(store.getState().router)).to.be.true;
      });
    });
  });
});
