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
                        publicKey: action.payload.publicKey,
                        id: action.payload.publicKey.n,
                    },
                ],
            };
        case "USER_ENTER":
            const members = _.uniqBy(action.payload.users, member => member.publicKey.n);

            return {
                ...state,
                id: action.payload.id,
                isLocked: Boolean(action.payload.isLocked),
                members: members.reduce((acc, user) => {
                    const exists = state.members.find(m => m.publicKey.n === user.publicKey.n);
                    if (exists) {
                        return [ ...acc, {...user, ...exists} ];
                    }
                    return [ ...acc,
                        {
                            publicKey: user.publicKey,
                            isOwner: user.isOwner,
                            id: user.publicKey.n
                        },
                    ];
                }, [])
            };
        case 'RECEIVE_ENCRYPTED_MESSAGE_ADD_USER':
            return {
                ...state,
                members: state.members.map(member => {
                    if (member.publicKey.n === action.payload.payload.publicKey.n) {
                        return {
                            ...member,
                            username: action.payload.payload.username,
                            isOwner: action.payload.payload.isOwner,
                            id: action.payload.payload.publicKey.n,
                        };
                    }
                    return member;
                }),
            };
        case "USER_EXIT":
            const memberIds = action.payload.members.map(m => m.publicKey.n);

            return {
                ...state,
                members: state.members
                    .filter(member => memberIds.includes(member.publicKey.n))
                    .map(member => {
                        const thisMember = action.payload.members.find(mem => mem.publicKey.n === member.id);
                        if (thisMember) {
                            return { ...member, isOwner: thisMember.isOwner};
                        }
                        return { ...member };
                    }),
            }
        case 'TOGGLE_LOCK_ROOM':
            return {
                ...state,
                isLocked: action.payload.locked,
            };
        case 'RECEIVE_TOGGLE_LOCK_ROOM':
            return {
                ...state,
                isLocked: action.payload.locked,
            };
        default:
            return state

    }
}

export default room
