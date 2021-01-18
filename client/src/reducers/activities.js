const initialState = {
    items: [],
}

const activities = (state = initialState, action) => {
    switch (action.type) {
        case "SEND_ENCRYPTED_MESSAGE_TEXT_MESSAGE":
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...action.payload,
                        type: "TEXT_MESSAGE"
                    }
                ]
            }
        case "RECEIVE_ENCRYPTED_MESSAGE_TEXT_MESSAGE":
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...action.payload.payload,
                        type: "TEXT_MESSAGE"
                    }
                ]
            }
        case "RECEIVE_ENCRYPTED_MESSAGE_ADD_USER":
            const newUserId = action.payload.payload.id;

            const haveUser = state.items.filter(s => s.type === "USER_ENTER" && s.userId === newUserId).length;
            if (haveUser !== 0) {
                return state;
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        type: "USER_ENTER",
                        userId: newUserId,
                        username: action.payload.payload.username,
                    },
                ]
            }
        case "USER_EXIT":
            if (!action.payload.id) {
                return state;
            }
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        type: "USER_EXIT",
                        userId: action.payload.id,
                        username: action.payload.username,
                    },
                ],
            };
        case "TOGGLE_LOCK_ROOM":
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        type: "TOGGLE_LOCK_ROOM",
                        username: action.payload.username,
                        userId: action.payload.id,
                        locked: action.payload.locked,
                        sender: action.payload.sender,
                    }
                ]
            }
        case "RECEIVE_TOGGLE_LOCK_ROOM":
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        type: "TOGGLE_LOCK_ROOM",
                        username: action.payload.username,
                        userId: action.payload.id,
                        locked: action.payload.locked,
                        sender: action.payload.sender,
                    }
                ]
            }
        default:
            return state;
    }
}

export default activities