'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports['default'] = jsdomReact;

var _ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

var _ExecutionEnvironment2 = _interopRequireWildcard(_ExecutionEnvironment);

var _jsdom = require('mocha-jsdom');

var _jsdom2 = _interopRequireWildcard(_jsdom);

function jsdomReact() {
  _jsdom2['default']();
  _ExecutionEnvironment2['default'].canUseDOM = true;
}

module.exports = exports['default'];