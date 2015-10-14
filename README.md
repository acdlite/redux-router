redux-router
============

[![build status](https://img.shields.io/travis/rackt/redux-router/master.svg?style=flat-square)](https://travis-ci.org/rackt/redux-router)
[![npm version](https://img.shields.io/npm/v/redux-router.svg?style=flat-square)](https://www.npmjs.com/package/redux-router)

**Documentation is in progress. Please refer to the [basic example](https://github.com/rackt/redux-router/tree/master/examples/basic) in the meantime.**

Redux bindings for React Router.

- Keep your router state inside your Redux Store.
- Interact with the Router with the same API you use to interact with the rest of your app state.
- Completely interoperable with existing React Router API. `<Link />`, `router.transitionTo()`, etc. still work.
- Serialize and deserialize router state.
- Works with time travel feature of Redux Devtools!

```js
npm install --save redux-router@1.0.0-beta3
```

## Why

React Router is a fantastic routing library, but one downside is that it abstracts away a very crucial piece of application state — the current route! This abstraction is super useful for route matching and rendering, but the API for interacting with the router to 1) trigger transitions and 2) react to state changes within the component lifecycle leaves something to be desired.

It turns out we already solved these problems with Flux (and Redux): We use action creators to trigger state changes, and we use higher-order components to subscribe to state changes.

This library allows you to keep your router state **inside your Redux store**. So getting the current pathname, query, and params is as easy as selecting any other part of your application state.

## Example

```js
import React from 'react';
import { combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';

// Configure routes like normal
const routes = (
  <Route path="/" component={App}>
    <Route path="parent" component={Parent}>
      <Route path="child" component={Child} />
      <Route path="child/:id" component={Child} />
    </Route>
  </Route>
);

// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below
const reducer = combineReducers({
  router: routerStateReducer
});

// Compose reduxReactRouter with other store enhancers
const store = compose(
  applyMiddleware(m1, m2, m3),
  reduxReactRouter({
    routes,
    createHistory
  }),
  devTools()
)(createStore)(reducer);


// Elsewhere, in a component module...
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

connect(
  // Use a selector to subscribe to state
  state => ({ q: state.router.location.query.q }),

  // Use an action creator for navigation
  { pushState }
)(SearchBox);
```
### Server Example
```js
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ReduxRouter, routerStateReducer } from 'redux-router'
import { reduxReactRouter, match } from 'redux-router/server'
import routes from './routes'

import { createStore, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import reducer1 from './reducers/reducer1'

function index(innerHtml, initialState) {
  return `<html>
  <head><title>Title</title></head>
  <body>
    <div id="container">${innerHtml}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
    <script src="app.js"></script>
  </body>
</html>
`
}

expressServer.use(function(req, res, next) {
  const reducer = combineReducers({
    router: routerStateReducer,
    reducer1
  })
  const store = compose(
    reduxReactRouter({ routes })
  )(createStore)(reducer)
  // Use redux-router match function and dispatch the result.
  // If migrating from react-router make sure you are using redux-router match
  store.dispatch(match(req.url, (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      // Use ReduxRouter rather than RouterContext if migrating from react-router
      var app = <Provider store={store}><ReduxRouter {...renderProps} /></Provider>
      try {
        var html = ReactDOMServer.renderToString(app)
        var result = index(html, store.getState())
        res.status(200).send(result)
      } catch (e) {
        console.log('Failed to render', e)
        next()
      }
    } else {
      next()
    }
  }))
})
```

### Works with Redux Devtools (and other external state changes)

redux-router will notice if the router state in your Redux store changes from an external source other than the router itself — e.g. the Redux Devtools — and trigger a transition accordingly!

## API

### `reduxReactRouter({ routes, createHistory, routerStateSelector })`

A Redux store enhancer that adds router state to the store.

### `routerStateReducer(state, action)`

A reducer that keeps track of Router state.

### `<ReduxRouter>`

A component that renders a React Router app using router state from a Redux store.

### `pushState(state, pathname, query)`

An action creator for `history.pushState()`.

### `replaceState(state, pathname, query)`

An action creator for `history.replaceState()`.

## Bonus: Reacting to state changes with redux-rx

This library pairs well with [redux-rx](https://github.com/acdlite/redux-rx) to trigger route transitions in response to state changes. Here's a simple example of redirecting to a new page after a successful login:

```js
const LoginPage = createConnector(props$, state$, dispatch$, () => {
  const actionCreators$ = bindActionCreators(actionCreators, dispatch$);
  const pushState$ = actionCreators$.map(ac => ac.pushState);

  // Detect logins
  const didLogin$ = state$
    .distinctUntilChanged(state => state.loggedIn)
    .filter(state => state.loggedIn);

  // Redirect on login!
  const redirect$ = didLogin$
    .withLatestFrom(
      pushState$,
      // Use query parameter as redirect path
      (state, pushState) => () => pushState(null, state.router.query.redirect || '/')
    )
    .do(go => go());

  return combineLatest(
    props$, actionCreators$, redirect$,
    (props, actionCreators) => ({
      ...props,
      ...actionCreators
    });
});
```

A more complete example is forthcoming.
