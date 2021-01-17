import { getSocket } from "../utils/socket";
import { prepareMessage, processMessage } from "../utils/message";



export const sendEncryptedMessage = payload => async (dispatch, getState) => {
    const state = getState();
    const message = await prepareMessage(payload, state);
    dispatch({ type: `SEND_ENCRYPTED_MESSAGE_TEXT_MESSAGE`, payload: message.toSend})
    getSocket().emit("ENCRYPTED_MESSAGE", message.toSend);
}

export const receiveEncryptedMessage = payload => async (dispatch, getState) => {
    const state = getState();
    const message = await processMessage(payload, state);
    dispatch({ type: `RECEIVE_ENCRYPTED_MESSAGE_TEXT_MESSAGE`, payload: message})



}