'use strict';

var _replaceWith = require('../');

describe('replaceWith', function () {
  it('creates payload with pathname, query, state', function () {
    expect(_replaceWith.replaceWith('/some/path', { foo: 'bar' }, { key: 123 }).payload).to.eql({
      pathname: '/some/path',
      query: {
        foo: 'bar'
      },
      state: {
        key: 123
      }
    });
    expect(_replaceWith.replaceWith().payload).to.eql({
      pathname: undefined,
      query: undefined,
      state: undefined
    });
    expect(_replaceWith.replaceWith(null).payload).to.eql({
      pathname: null,
      query: undefined,
      state: undefined
    });
    expect(_replaceWith.replaceWith(false).payload).to.eql({
      pathname: false,
      query: undefined,
      state: undefined
    });
  });
});