import reducer from './activities';

describe('Activities reducer', () => {
    it('should handle SEND_ENCRYPTED_MESSAGE_TEXT_MESSAGE', () => {
        expect(
            reducer({ items: [] }, { type: 'SEND_ENCRYPTED_MESSAGE_TEXT_MESSAGE', payload: { payload: 'content' } }),
        ).toEqual({ items: [{ payload: 'content', type: 'TEXT_MESSAGE' }] });
    });

    it('should handle RECEIVE_ENCRYPTED_MESSAGE_TEXT_MESSAGE', () => {
        expect(
            reducer(
                { items: [] },
                { type: 'RECEIVE_ENCRYPTED_MESSAGE_TEXT_MESSAGE', payload: { payload: { payload: 'content' } } },
            ),
        ).toEqual({ items: [{ payload: 'content', type: 'TEXT_MESSAGE' }] });
    });

    it('should handle RECEIVE_ENCRYPTED_MESSAGE_ADD_USER', () => {
        const payload1 = {
            payload: {content: 'content', id: 'idalan', username: 'alan'},
            state: {
                room: {
                    members: [{id: 'iddan'}],
                },
            },
        };
        expect(reducer({items: []}, {type: 'RECEIVE_ENCRYPTED_MESSAGE_ADD_USER', payload: payload1})).toEqual({
            items: [{type: 'USER_ENTER', userId: 'idalan', username: 'alan'}],
        });
    });

    it('should handle USER_EXIT', () => {
        expect(reducer({ items: [] }, { type: 'USER_EXIT', payload: { id: 'idalan', username: 'alan' } })).toEqual({
            items: [{ type: 'USER_EXIT', userId: 'idalan', username: 'alan' }],
        });
        // Without id
        expect(reducer({ items: [] }, { type: 'USER_EXIT', payload: { username: 'alan' } })).toEqual({
            items: [],
        });
    });

    it('should handle TOGGLE_LOCK_ROOM', () => {
        expect(
            reducer(
                { items: [] },
                { type: 'TOGGLE_LOCK_ROOM', payload: { id: 'idalan', username: 'alan', locked: true, sender: 'alan' } },
            ),
        ).toEqual({
            items: [{ locked: true, sender: 'alan', type: 'TOGGLE_LOCK_ROOM', userId: 'idalan', username: 'alan' }],
        });
    });

    it('should handle RECEIVE_TOGGLE_LOCK_ROOM', () => {
        expect(
            reducer(
                { items: [] },
                { type: 'RECEIVE_TOGGLE_LOCK_ROOM', payload: { id: 'idalan', username: 'alan', locked: true, sender: 'alan' } },
            ),
        ).toEqual({
            items: [{ locked: true, sender: 'alan', type: 'TOGGLE_LOCK_ROOM', userId: 'idalan', username: 'alan' }],
        });
    });
});
