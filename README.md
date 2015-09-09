redux-react-router
==================

[![build status](https://img.shields.io/travis/acdlite/redux-react-router/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-react-router)
[![npm version](https://img.shields.io/npm/v/redux-react-router.svg?style=flat-square)](https://www.npmjs.com/package/redux-react-router)

## The next version of Redux React Router

This branch contains the next release of Redux React Router. This is a complete rewrite using the new, more modular primitives exposed by React Router v1.0.0-beta4. A pre-release is a available as v1.0.0-alpha1, but **please note that this version is not production-ready and considered unstable.** It currently depends on a React Router module that is not exported publicly (see https://github.com/rackt/react-router/pull/1852).

To install the prerelease:

```
npm install --save redux-react-router@prerelease
```

For this alpha, you'll also need to use a branch of React Router that exposes the `createRoutes.js` and `useRouting.js` modules. (These changes have been merged into master. Once a new React Router version is released, this will no longer be necessary.)

```
npm install --save react-router@git+https://github.com/acdlite/react-router.git#d8a41c86090ee661bc19b93c0a9169db510c46d8
```

Better docs are forthcoming; some of the information below may be outdated. In the meantime, you can play around with a [basic example](https://github.com/acdlite/redux-react-router/tree/next/examples/basic), or try it out yourself using a [forked version](https://github.com/acdlite/redux-react-router/blob/next/package.json#L38) of React Router.

***

Redux bindings for React Router.

- Keep your router state inside your Redux Store.
- Interact with the Router with the same API you use to interact with the rest of your app state.
- Completely interoperable with existing React Router API. `<Link />`, `router.transitionTo()`, etc. still work.
- Serialize and deserialize router state.
- Works with time travel feature of Redux Devtools!

```js
npm install --save redux-react-router
```

## Why

React Router is a fantastic routing library, but one downside is that it abstracts away a very crucial piece of application state — the current route! This abstraction is super useful for route matching and rendering, but the API for interacting with the router to 1) trigger transitions and 2) react to state changes within the component lifecycle leaves something to be desired. The official recommendations include a collection of [mixins](https://github.com/rackt/react-router/tree/master/doc/04%20Mixins) and accessing the router on the context object, neither of which are very appealing.

It turns out we already solved these problems with Flux (and Redux): We use action creators to trigger state changes, and we use higher-order components to subscribe to state changes.

This library allows you to keep your router state **inside your Redux store**. So getting the current pathname, query, and params is as easy as selecting any other part of your application state:

```js
// Current location: /search?q=redux
<Connector select={state => ({ q: state.router.query.q })}>
  {props => <SearchBox q={props.q} />}
</Connector>
```

There are also (optional) action creators that work just like their [history](https://github.com/rackt/history) equivalents:

```js
pushState(null, '/search', { q: 'redux' }));
replaceState(null, '/search', { q: 'redux' }));
```

### Works with Redux Devtools (and other external state changes)

redux-react-router will notice if the router state in your Redux store changes from an external source other than the router itself — e.g. the Redux Devtools — and trigger a transition accordingly!

## API

### `reduxReactRouter({ routes, createHistory })`

A Redux store enhancer that adds router state to the store.

### `routerStateReducer(state, action)`

A reducer that keeps track of Router state.

### `<ReduxRouter>`

A component that renders a React Router app from state provided by a `<Provider>`.

### `pushState(state, pathname, query)`

### `replaceWith(pathname, query, state)`

## Bonus: Reacting to state changes with redux-rx

This library pairs well with [redux-rx](https://github.com/acdlite/redux-rx) to trigger route transitions in response to state changes. Here's a simple example of redirecting to a new page after a successful login:

```js
const LoginPage = createConnector(props$, state$, dispatch$, () => {
  const actionCreators$ = bindActionCreators(actionCreators, dispatch$);
  const transitionTo$ = actionCreators$.map(ac => ac.transitionTo);

  // Detect logins
  const didLogin$ = state$
    .distinctUntilChanged(state => state.loggedIn)
    .filter(state => state.loggedIn);

  // Redirect on login!
  const redirect$ = didLogin$
    .withLatestFrom(
      transitionTo$,
      // Use query parameter as redirect path
      (state, transitionTo) => () => transitionTo(state.router.query.redirect || '/')
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
