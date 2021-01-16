
const initialState = {
    username: "",
    id: ""
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_USER":
            return {
                id: action.payload.id,
                username: action.payload.username,
            }
        default:
            return state
    }
};

export default user