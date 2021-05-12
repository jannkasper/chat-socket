import * as actions from './app';

describe('App actions', () => {
    it('should create all actions', () => {
        const mockDispatch = jest.fn();

        const actionsResults = [
            [actions.toggleSocketConnected('test'), 'TOGGLE_SOCKET_CONNECTED'],
            [actions.createUser('test'), 'CREATE_USER'],
        ];

        actionsResults.forEach(([action, type]) => {
            action(mockDispatch);
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type,
                payload: 'test',
            });
        });
    });
});
