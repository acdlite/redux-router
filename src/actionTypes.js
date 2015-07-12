// There are two actions types:
//
// 1. TRANSITION_TO is used by the application to trigger a route transition.
// It depends on routerMiddleware to intercept the action and call
// router.transitionTo(). The action never gets sent to the reducer.
// 2. LOCATION_DID_CHANGE signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
//
// TRANSITION_TO is optional. Normal calls to `transitionTo()` — including via
// the <Link /> component, will continue to work as expected.
export const TRANSITION_TO = '@@reduxReactRouter/transitionTo';
export const LOCATION_DID_CHANGE = '@@reduxReactRouter/locationDidChange';
