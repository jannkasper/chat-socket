
export const createUser = payload => async dispatch => {
    dispatch({ type: 'CREATE_USER', payload });
};

const receiveUserEnter = (payload, dispatch) => {
    dispatch({ type: 'USER_ENTER', payload });
};

const receiveUserExit = (payload, dispatch, getState) => {
    const state = getState();
    const payloadIds = payload.map(member => member.publicKey.n);
    const exitingUser = state.room.members.find(member => !payloadIds.includes(member.id));

    if (!exitingUser) {
        return;
    }

    const exitingUserId = exitingUser.id;
    const exitingUsername = exitingUser.username;

    dispatch({
        type: 'USER_EXIT',
        payload: {
            members: payload,
            id: exitingUserId,
            username: exitingUsername
        }
    });
};

export const receiveUnencryptedMessage = (type, payload) => async (dispatch, getState) => {
    switch (type) {
        case 'USER_ENTER':
            return receiveUserEnter(payload, dispatch);
        case 'USER_EXIT':
            return receiveUserExit(payload, dispatch, getState);
        default:
            return;
    }
};