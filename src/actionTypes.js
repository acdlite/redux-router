// There are three action types:
//
// 1. TRANSITION_TO is used by the application to trigger a route transition.
// It depends on routerMiddleware to intercept the action and call
// router.transitionTo(). The action never gets sent to the reducer.
// 2. REPLACE_WITH is the same as TRANSITION_TO
// 3. LOCATION_DID_CHANGE signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
//
// TRANSITION_TO/REPLACE_WITH are optional. Normal calls to
// `transitionTo() / replaceWith()` — including via
// the <Link /> component, will continue to work as expected.
export const TRANSITION_TO = '@@reduxReactRouter/transitionTo';
export const REPLACE_WITH = '@@reduxReactRouter/replaceWith';
export const LOCATION_DID_CHANGE = '@@reduxReactRouter/locationDidChange';
