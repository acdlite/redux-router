redux-router
============

[![build status](https://img.shields.io/travis/acdlite/redux-router/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-router)
[![npm version](https://img.shields.io/npm/v/redux-router.svg?style=flat-square)](https://www.npmjs.com/package/redux-router)
[![redux-router on discord](https://img.shields.io/badge/discord-redux--router@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bVkq8Eo)

## This project is experimental.

### In most cases, you don’t need any library to bridge Redux and React Router. Just use React Router directly.

## Please check out [the differences between react-router-redux and redux-router](#differences-with-react-router-redux) before using this library

[Redux](redux.js.org) bindings for [React Router](https://github.com/reactjs/react-router).

- Keep your router state inside your Redux Store.
- Interact with the Router with the same API you use to interact with the rest of your app state.
- Completely interoperable with existing React Router API. `<Link />`, `router.transitionTo()`, etc. still work.
- Serialize and deserialize router state.
- Works with time travel feature of Redux Devtools!

```sh
npm install --save redux-router@1.0.0-beta8
```

## Why

React Router is a fantastic routing library, but one downside is that it abstracts away a very crucial piece of application state — the current route! This abstraction is super useful for route matching and rendering, but the API for interacting with the router to 1) trigger transitions and 2) react to state changes within the component lifecycle leaves something to be desired.

It turns out we already solved these problems with Flux (and Redux): We use action creators to trigger state changes, and we use higher-order components to subscribe to state changes.

This library allows you to keep your router state **inside your Redux store**. So getting the current pathname, query, and params is as easy as selecting any other part of your application state.

## Example

```js
import React from 'react';
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';
import { createHistory } from 'history';
import { Route } from 'react-router';

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
  router: routerStateReducer,
  //app: rootReducer, //you can combine all your other reducers under a single namespace like so
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
import { push } from 'redux-router';

connect(
  // Use a selector to subscribe to state
  state => ({ q: state.router.location.query.q }),

  // Use an action creator for navigation
  { push }
)(SearchBox);
```

You will find a **server-rendering** example in the repo´s example directory.

### Works with Redux Devtools (and other external state changes)

redux-router will notice if the router state in your Redux store changes from an external source other than the router itself — e.g. the Redux Devtools — and trigger a transition accordingly!

## Differences with react-router-redux

#### react-router-redux

[react-router-redux](https://github.com/reactjs/react-router-redux) (formerly redux-simple-router) takes a different approach to
integrating routing with redux. react-router-redux lets React Router do all the heavy lifting and syncs the url data to a history
[location](https://github.com/mjackson/history/blob/master/docs/Location.md#location) object in the store. This means that users can use
React Router's APIs directly and benefit from the wide array of documentation and examples there.

The README for react-router-redux has a useful picture included here:

[redux](https://github.com/reactjs/redux) (`store.routing`) &nbsp;&harr;&nbsp; [**react-router-redux**](https://github.com/reactjs/react-router-redux) &nbsp;&harr;&nbsp; [history](https://github.com/reactjs/history) (`history.location`) &nbsp;&harr;&nbsp; [react-router](https://github.com/reactjs/react-router)

This approach, while simple to use, comes with a few caveats:
  1. The history location object does not include React Router params and they must be either passed down from a React Router component or recomputed.
  2. It is discouraged (and dangerous) to connect the store data to a component because the store data potentially updates **after** the React Router properties have changed, therefore there can be race conditions where the location store data differs from the location object passed down via React Router to components.

react-router-redux encourages users to use props directly from React Router in the components (they are passed down to any rendered route components). This means that if you want to access the location data far down the component tree, you may need to pass it down or use React's context feature.

#### redux-router

This project, on the other hand takes the approach of storing the **entire** React Router data inside the redux store. This has the main benefit that it becomes impossible for the properties passed down by redux-router to the components in the Route to differ from the data included in the store. Therefore feel free to connect the router data to any component you wish. You can also access the route params from the store directly. redux-router also provides an API for hot swapping the routes from the Router (something React Router does not currently provide).

The picture of redux-router would look more like this:

[redux](https://github.com/reactjs/redux) (`store.router`) &nbsp;&harr;&nbsp; [**redux-router**](https://github.com/acdlite/redux-router) &nbsp;&harr;&nbsp; [react-router (via RouterContext)](https://github.com/reactjs/react-router)

This approach, also has its set of limitations:
  1. The router data is not all serializable (because Components and functions are not direclty serializable) and therefore this can cause issues with some devTools extensions and libraries that help in saving the store to the browser session. This can be mitigated if the libraries offer ways to ignore seriliazing parts of the store but is not always possible.
  2. redux-router takes advantage of the RouterContext to still use much of React Router's internal logic. However, redux-router must still implement many things that React Router already does on its own and can cause delays in upgrade paths.
  3. redux-router must provide a slightly different top level API (due to 2) even if the Route logic/matching is identical


Ultimately, your choice in the library is up to you and your project's needs. react-router-redux will continue to have a larger support
in the community due to its inclusion into the reactjs github organization and visibility. **react-router-redux is the recommended approach**
for react-router and redux integration. However, you may find that redux-router aligns better with your project's needs.
redux-router will continue to be mantained as long as demand exists.

## API

### `reduxReactRouter({ routes, createHistory, routerStateSelector })`

A Redux store enhancer that adds router state to the store.

### `routerStateReducer(state, action)`

A reducer that keeps track of Router state.

### `<ReduxRouter>`

A component that renders a React Router app using router state from a Redux store.

### `push(location)`

An action creator for `history.push()`. [mjackson/history/docs/GettingStarted.md#navigation](https://github.com/mjackson/history/blob/master/docs/GettingStarted.md#navigation)

Basic example (let say we are at `http://example.com/orders/new`):
```js
dispatch(push('/orders/' + order.id));
```
Provided that `order.id` is set and equals `123` it will change browser address bar to `http://example.com/orders/123` and appends this URL to the browser history (without reloading the page).

A bit more advanced example:
```js
dispatch(push({
  pathName: '/orders',
  query: { filter: 'shipping' }
}));
```
This will change the browser address bar to `http://example.com/orders?filter=shipping`.

**NOTE:** clicking back button will change address bar back to `http://example.com/orders/new` but will **not** change page content

### `replace(location)`

An action creator for `history.replace()`. [mjackson/history/docs/GettingStarted.md#navigation](https://github.com/mjackson/history/blob/master/docs/GettingStarted.md#navigation)

Works similar to the `push` except that it doesn't create new browser history entry.

**NOTE:** Referring to the `push` example: clicking back button will change address bar back to the URL before `http://example.com/orders/new` and will change page content.

## Handling authentication via a higher order component

@joshgeller threw together a good example on how to handle user authentication via a higher order component. Check out [joshgeller/react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)

## Bonus: Reacting to state changes with redux-rx

This library pairs well with [redux-rx](https://github.com/acdlite/redux-rx) to trigger route transitions in response to state changes. Here's a simple example of redirecting to a new page after a successful login:

```js
const LoginPage = createConnector(props$, state$, dispatch$, () => {
  const actionCreators$ = bindActionCreators(actionCreators, dispatch$);
  const push$ = actionCreators$.map(ac => ac.push);

  // Detect logins
  const didLogin$ = state$
    .distinctUntilChanged(state => state.loggedIn)
    .filter(state => state.loggedIn);

  // Redirect on login!
  const redirect$ = didLogin$
    .withLatestFrom(
      push$,
      // Use query parameter as redirect path
      (state, push) => () => push(state.router.query.redirect || '/')
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
