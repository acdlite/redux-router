// There are three action types:
//
// 1. PUSH_STATE is used by the application to trigger a route transition.
// It depends on historyMiddleware() to intercept the action and call
// history.pushState(). The action never gets sent to the reducer.
// 2. REPLACE_STATE is the same as PUSH_STATE, except it triggers replaceState()
// 3. LOCATION_DID_CHANGE signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
//
// TRANSITION_TO/REPLACE_WITH are optional. Normal calls to
// `transitionTo() / replaceWith()` — including via
// the <Link /> component, will continue to work as expected.
export const PUSH_STATE = '@@reduxReactRouter/pushState';
export const REPLACE_STATE = '@@reduxReactRouter/replaceState';
export const ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';

// Hidden store properties that allow the store enhancer to expose certain non-
// state things to <ReduxRouter>, so the user doesn't have to configure them
// in both places:
//
// Exposes the router state selector
export const ROUTER_STATE_SELECTOR = '@@reduxReactRouter/routerStateSelector';
