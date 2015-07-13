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
});
