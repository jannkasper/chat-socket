
exports.prepareMessage = (payload, state) =>
    new Promise(async resolve => {
        const myUsername = state.user.username;


        resolve({
            toSend : {
                username: myUsername,
                text: payload.payload.text,
            }
        });
    });

exports.processMessage = (payload, state) =>
    new Promise(async resolve => {
        const username = payload.payload.username;
        const text = payload.payload.text;

        resolve({
            username,
            text

        });
    });
