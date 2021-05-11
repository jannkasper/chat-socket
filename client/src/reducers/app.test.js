import reducer from './app';

describe('App reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            socketConnected: false,
        });
    });

    it('should handle TOGGLE_SOCKET_CONNECTED', () => {
        expect(reducer({}, { type: 'TOGGLE_SOCKET_CONNECTED', payload: true })).toEqual({
            socketConnected: true,
        });
    });
});
