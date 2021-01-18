const initialState = {
    socketConnected: false,
}

const app = (state = initialState, action) => {
    switch (action.type) {
        case "TOGGLE_SOCKET_CONNECTED":
            return {
                ...state,
                socketConnected: action.payload,
            };
        default:
            return state;
    }
}

export default app