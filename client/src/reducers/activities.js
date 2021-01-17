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
                        ...action.payload,
                        type: "TEXT_MESSAGE"
                    }
                ]
            }
        default:
            return state;
    }
}

export default activities