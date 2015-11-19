// Signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
export const ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';

export const HISTORY_API = '@@reduxReactRouter/historyAPI';
export const MATCH = '@@reduxReactRouter/match';
export const INIT_ROUTES = '@@reduxReactRouter/initRoutes';
export const REPLACE_ROUTES = '@@reduxReactRouter/replaceRoutes';

export const ROUTER_STATE_SELECTOR = '@@reduxReactRouter/routerStateSelector';

export const DOES_NEED_REFRESH = '@@reduxReactRouter/doesNeedRefresh';
