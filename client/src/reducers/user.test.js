import reducer from './user';

describe('User reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ id: '', privateKey: {}, publicKey: {}, username: '' });
  });

  it('should handle CREATE_USER', () => {
    const payload = { publicKey: { n: 'alicekey' }, username: 'alice' };
    expect(reducer({}, { type: 'CREATE_USER', payload })).toEqual({
      id: 'alicekey',
      publicKey: { n: 'alicekey' },
      username: 'alice',
    });
  });
});
