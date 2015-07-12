import { transitionTo } from '../';

describe('transitionTo', () => {
  it('accepts a pathname', () => {
    const action = transitionTo('/some/path');
    expect(action.payload).to.eql({ pathname: '/some/path' });
  });

  it('accepts a object', () => {
    const object = { pathname: '/some/path', query: { foo: 'bar' } };
    const action = transitionTo(object);
    expect(action.payload).to.eql(object);
  });

  it('returns empty object for falsy-values', () => {
    expect(transitionTo().payload).to.eql({});
    expect(transitionTo(null).payload).to.eql({});
    expect(transitionTo(false).payload).to.eql({});
  });
});
