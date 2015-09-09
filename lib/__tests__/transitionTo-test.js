'use strict';

var _transitionTo = require('../');

describe('transitionTo', function () {
  it('creates payload with pathname, query, state', function () {
    expect(_transitionTo.transitionTo('/some/path', { foo: 'bar' }, { key: 123 }).payload).to.eql({
      pathname: '/some/path',
      query: {
        foo: 'bar'
      },
      state: {
        key: 123
      }
    });
    expect(_transitionTo.transitionTo().payload).to.eql({
      pathname: undefined,
      query: undefined,
      state: undefined
    });
    expect(_transitionTo.transitionTo(null).payload).to.eql({
      pathname: null,
      query: undefined,
      state: undefined
    });
    expect(_transitionTo.transitionTo(false).payload).to.eql({
      pathname: false,
      query: undefined,
      state: undefined
    });
  });
});