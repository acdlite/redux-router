'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _locationStateEquals = require('../locationStateEquals');

var _locationStateEquals2 = _interopRequireWildcard(_locationStateEquals);

describe('locationStateEquals', function () {
  it('compares keys', function () {
    expect(_locationStateEquals2['default']({ key: '12345' }, { key: '12345' })).to.be['true'];
    expect(_locationStateEquals2['default']({ key: '12345' }, { key: 'lolwut' })).to.be['false'];
  });
});