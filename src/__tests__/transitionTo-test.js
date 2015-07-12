import { transitionTo } from '../';

describe('transitionTo', () => {
  it('creates payload with pathname, query, state', () => {
    expect(transitionTo('/some/path', { foo: 'bar' }, { key: 123 }).payload)
      .to.eql({
        pathname: '/some/path',
        query: {
          foo: 'bar'
        },
        state: {
          key: 123
        }
      });
    expect(transitionTo().payload).to.eql({
      pathname: undefined,
      query: undefined,
      state: undefined
    });
    expect(transitionTo(null).payload).to.eql({
      pathname: null,
      query: undefined,
      state: undefined
    });
    expect(transitionTo(false).payload).to.eql({
      pathname: false,
      query: undefined,
      state: undefined
    });
  });
});
