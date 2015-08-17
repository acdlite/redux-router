import { replaceWith } from '../';

describe('replaceWith', () => {
  it('creates payload with pathname, query, state', () => {
    expect(replaceWith('/some/path', { foo: 'bar' }, { key: 123 }).payload)
      .to.eql({
        pathname: '/some/path',
        query: {
          foo: 'bar'
        },
        state: {
          key: 123
        }
      });
    expect(replaceWith().payload).to.eql({
      pathname: undefined,
      query: undefined,
      state: undefined
    });
    expect(replaceWith(null).payload).to.eql({
      pathname: null,
      query: undefined,
      state: undefined
    });
    expect(replaceWith(false).payload).to.eql({
      pathname: false,
      query: undefined,
      state: undefined
    });
  });
});
