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

            const haveUser = state.items.filter(s => s.type === "USER_ENTER" && s.userId == newUserId).length;
            if (haveUser != 0) {
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
        default:
            return state;
    }
}

export default activities