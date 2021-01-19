
export const prepare = (payload, state) =>
    new Promise(async resolve => {
        const myUsername = state.user.username;
        const myId = state.user.id;

        const jsonToSend = {
            ...payload,
            payload: {
                ...payload.payload,
                sender: myId,
                username: myUsername,
                text: encodeURI(payload.payload.text),
            },
        };

        const payloadString = JSON.stringify(jsonToSend);


        resolve({
            toSend : {
                payload: payloadString,
            },
            original: jsonToSend
        });
    });

export const process = (payload, state) =>
    new Promise(async resolve => {
        resolve(JSON.parse(payload.payload.payload));
    });
