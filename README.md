redux-react-router
==================

[![build status](https://img.shields.io/travis/acdlite/redux-react-router/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-react-router)
[![npm version](https://img.shields.io/npm/v/redux-react-router.svg?style=flat-square)](https://www.npmjs.com/package/redux-react-router)

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

React Router is a fantastic routing library, but one downside that it abstracts away a very crucial piece of application state — the current route! This abstraction is super useful for route matching and rendering, but the API for interacting with the router to 1) trigger transitions and 2) react to state changes within the component lifecycle leaves something to be desired. The official recommendations include a collection of [mixins](https://github.com/rackt/react-router/tree/master/doc/04%20Mixins) and accessing the router on the context object, neither of which are very appealing.

It turns out we already solved these problems with Flux (and Redux): We use action creators to trigger state changes, and we use higher-order components to subscribe to state changes.

This library allows you to keep your router state **inside your Redux store**. So getting the current pathname, query, and params is as easy as selecting any other part of your application state:

```js
// Current location: /search?q=redux
<Connector select={state => ({ q: state.router.query.q })}>
  {props => <SearchBox q={props.q} />}
</Connector>
```

There's also an (optional) action creator that will trigger a route change:

```js
dispatch(transitionTo('/search?q=redux'));
dispatch(transitionTo({ pathname: '/search', query: { q: 'redux' } });
// Or after using bindActionCreators() or equivalent
transitionTo('/search?q=redux');
transitionTo({ pathname: '/search', query: { q: 'redux' } });
```

### Works with Redux Devtools (and other external state changes)

redux-react-router will notice if the router state in your Redux store changes from an external source other than the router itself — e.g. the Redux Devtools — and trigger a transition accordingly!

## Usage

First, add a new Route to your route configuration that wraps around all the other routes:

```js
import { reduxRouteComponent } from 'redux-react-router';

<Router history={history}>
  <Route component={reduxRouteComponent(store)}>
    <Route path="/" component={App}>
      <Route path="/foo" component={Foo} />
      <Route path="/bar" component={Bar} />
    </Route>
  </Route>
</Router>
```

`reduxRouteComponent()` creates a component that you pass to `<Route />`. This sets up your store to listen to route transitions.

**NOTE:** This probably isn't the ideal API I'd create from scratch, but I'm working within the limits of React Router's current API.

This will also add your to context, replacing the need to use a `<Provider />`.

**NOTE:** React 0.13 and below use owner-based context. Long story short, you'll still need to use a `<Provider />` until React 0.14 is out of beta. Until then, you also won't be able to use the `transitionTo()` action creator. The normal React Router API for transitions will continue to work, however, as will state updates.

Next, configure your reducer to respond to route transitions:

```js
import { routerStateReducer } from 'redux-react-router';

const reducer = combineReducers({
  router: routerStateReducer,
  ...otherReducers
})
```

The router state should be stored at `state.router` in order to properly detect state changes. A helpful warning will be printed to the console if the reducer is improperly configured.

## API

### `reduxRouteComponent(store)`

Creates a component to be passed to `<Route component={component} />`. The `<Route />` should wrap all the other routes.

### `routerStateReducer(state, action)`

A reducer that keeps track of Router state. Be sure it's configured such that the router state is located on the main state object at `state.router`. This is simple using `combineReducers()` — see the example in the Usage section above.

### `transitionTo(pathname | { pathname, query, state })`

An action creator that works like [`router.transitionTo()`](https://github.com/rackt/react-router/blob/master/doc/04%20Mixins/Navigation.md#transitionto).

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

  // Use query parameter as redirect path
  const redirectPath$ = state$.map(state => state.router.query.redirect);

  // Redirect on login!
  const redirect$
    .withLatestFrom(
      didLogin$, redirectPath$, transitionTo$
      (state, path, transitionTo) => transitionTo(path || '/')
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
