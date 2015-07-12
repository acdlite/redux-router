import locationStateEquals from '../locationStateEquals';

describe('locationStateEquals', () => {
  it('compares keys', () => {
    expect(locationStateEquals(
      { key: '12345' },
      { key: '12345' }
    )).to.be.true;
    expect(locationStateEquals(
      { key: '12345' },
      { key: 'lolwut' }
    )).to.be.false;
  });

  it('returns true both are false-y', () => {
    expect(locationStateEquals(
      { key: null },
      { key: undefined },
    )).to.be.true;
    expect(locationStateEquals(
      { key: null },
      { key: null },
    )).to.be.true;
    expect(locationStateEquals(
      { key: null },
      { key: 'hi' },
    )).to.be.false;
  });
});
