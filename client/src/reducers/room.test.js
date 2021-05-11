import reducer from './room';

describe('Room reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({ id: '', isLocked: false, members: [] });
    });

    it('should handle CREATE_USER', () => {
        const state = {
            members: [
                { publicKey: { n: 'alankey' }, id: 'alankey', username: 'alan', isOwner: true },
                { publicKey: { n: 'alicekey' }, id: 'alicekey', username: 'alice', isOwner: false },
            ],
        };
        const payload = {
            username: 'dan',
            publicKey: { n: 'danKey' },
        };
        expect(reducer(state, { type: 'CREATE_USER', payload: payload })).toEqual({
            members: [
                { id: 'alankey', isOwner: true, publicKey: { n: 'alankey' }, username: 'alan' },
                { id: 'alicekey', isOwner: false, publicKey: { n: 'alicekey' }, username: 'alice' },
                { id: 'danKey', publicKey: { n: 'danKey' }, username: 'dan' },
            ],
        });
    });

    it('should handle USER_ENTER', () => {
        const state = {
            members: [
                { publicKey: { n: 'alankey' }, id: 'alankey', username: 'alan', isOwner: true },
                { publicKey: { n: 'alicekey' }, id: 'alicekey', username: 'alice', isOwner: false },
            ],
        };
        const payload = {
            users: [
                { publicKey: { n: 'alankey' }, id: 'alankey', username: 'alan', isOwner: true },
                { publicKey: { n: 'alicekey' }, id: 'alicekey', username: 'alice', isOwner: false },
                { publicKey: { n: 'dankey' }, id: 'dankey', username: 'dan', isOwner: false },
            ],
            isLocked: false,
            id: 'test',
        };
        expect(reducer(state, { type: 'USER_ENTER', payload: payload })).toEqual({
            id: 'test',
            isLocked: false,
            members: [
                { id: 'alankey', isOwner: true, publicKey: { n: 'alankey' }, username: 'alan' },
                { id: 'alicekey', isOwner: false, publicKey: { n: 'alicekey' }, username: 'alice' },
                { id: 'dankey', isOwner: false, publicKey: { n: 'dankey' } },
            ],
        });
    });

    it('should handle RECEIVE_ENCRYPTED_MESSAGE_ADD_USER', () => {
        const state = {
            members: [
                { publicKey: { n: 'alankey' }, id: 'alankey', username: 'alan', isOwner: true },
                { publicKey: { n: 'alicekey' }, id: 'alicekey', username: 'alice', isOwner: false },
                { publicKey: { n: 'dankey' }, id: 'dankey', username: 'dan', isOwner: false },
            ],
        };
        const payload = {
            payload: {
                username: 'dany',
                isOwner: true,
                publicKey: { n: 'dankey' },
            },
        };
        expect(reducer(state, { type: 'RECEIVE_ENCRYPTED_MESSAGE_ADD_USER', payload: payload })).toEqual({
            members: [
                { id: 'alankey', isOwner: true, publicKey: { n: 'alankey' }, username: 'alan' },
                { id: 'alicekey', isOwner: false, publicKey: { n: 'alicekey' }, username: 'alice' },
                { id: 'dankey', isOwner: true, publicKey: { n: 'dankey' }, username: 'dany' },
            ],
        });
    });

    it('should handle USER_EXIT', () => {
        const state = {
            members: [
                { publicKey: { n: 'dankey' }, id: 'dankey', username: 'dan', isOwner: true },
                { publicKey: { n: 'alankey' }, id: 'alankey', username: 'alan', isOwner: false },
                { publicKey: { n: 'alicekey' }, id: 'alicekey', username: 'alice', isOwner: false },
            ],
        };
        const payload = {
            members: [
                { publicKey: { n: 'alankey' }, isOwner: true },
                { publicKey: { n: 'alicekey' }, isOwner: false },
            ],
        };
        expect(reducer(state, { type: 'USER_EXIT', payload: payload })).toEqual({
            members: [
                { id: 'alankey', isOwner: true, publicKey: { n: 'alankey' }, username: 'alan' },
                { id: 'alicekey', isOwner: false, publicKey: { n: 'alicekey' }, username: 'alice' },
            ],
        });
    });

    it('should handle TOGGLE_LOCK_ROOM', () => {
        expect(reducer({ isLocked: true }, { type: 'TOGGLE_LOCK_ROOM', payload: { locked: false } })).toEqual({ isLocked: false });
    });

    it('should handle RECEIVE_TOGGLE_LOCK_ROOM', () => {
        expect(reducer({ isLocked: true }, { type: 'RECEIVE_TOGGLE_LOCK_ROOM', payload: { locked: false } })).toEqual({
            isLocked: false,
        });
    });
});
