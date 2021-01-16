import _ from 'lodash';


const initialState = {
    members: [
        // {
        //   username,
        //   id
        // }
    ],
    id: "",
    isLocked: false,
}

const room = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_USER":
            return {
                ...state,
                members: [
                    ...state.members,
                    {
                        username: action.payload.username,
                        id: action.payload.id
                    },
                ],
            };
        case "USER_ENTER":
            const members = _.uniqBy(action.payload.users, member => member.id);

            return {
                ...state,
                id: action.payload.id,
                isLocked: Boolean(action.payload.isLocked),
                members: members.reduce((acc, user) => {
                    const exists = state.members.find(m => m.id === user.id);
                    if (exists) {
                        return [ ...acc, {...user, ...exists} ];
                    }
                    return [ ...acc, {...user} ];
                }, [])
            };
        case "USER_EXIT":
            const memberIds = action.payload.members.map(m => m.id);

            return {
                ...state,
                members: state.members
                    .filter(member => memberIds.includes(member.id))
                    .map(member => {
                        const thisMember = action.payload.members.find(mem => mem.id === member.id);
                        if (thisMember) {
                            return { ...member, isOwner: thisMember.isOwner};
                        }
                        return { ...member };
                    }),
            }
        default:
            return state

    }
}

export default room
