// Signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
'use strict';

exports.__esModule = true;
var ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';

exports.ROUTER_DID_CHANGE = ROUTER_DID_CHANGE;
var HISTORY_API = '@@reduxReactRouter/historyAPI';
exports.HISTORY_API = HISTORY_API;
var MATCH = '@@reduxReactRouter/match';
exports.MATCH = MATCH;
var INIT_ROUTES = '@@reduxReactRouter/initRoutes';
exports.INIT_ROUTES = INIT_ROUTES;
var REPLACE_ROUTES = '@@reduxReactRouter/replaceRoutes';

exports.REPLACE_ROUTES = REPLACE_ROUTES;
var ROUTER_STATE_SELECTOR = '@@reduxReactRouter/routerStateSelector';

exports.ROUTER_STATE_SELECTOR = ROUTER_STATE_SELECTOR;
var DOES_NEED_REFRESH = '@@reduxReactRouter/doesNeedRefresh';
exports.DOES_NEED_REFRESH = DOES_NEED_REFRESH;