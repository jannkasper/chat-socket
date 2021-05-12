import * as actions from './encrypted_messages';
import * as message from "../utils/message";
import * as socket from '../utils/socket';

const mockDispatch = jest.fn();
const mockEmit = jest.fn();

describe('Encrypted messages actions', () => {
  it('should create an action to send message', async () => {
    jest.spyOn(message, "prepare").mockImplementation(() => {
      return {toSend: 'encryptedpayload', original: {type: 'TEXT_MESSAGE', payload: 'test'}}
    });
    jest.spyOn(socket, "getSocket").mockImplementation( () => ({ emit: mockEmit }));

    await actions.sendEncryptedMessage({ payload: 'payload' })(mockDispatch, jest.fn().mockReturnValue({ state: {} }));

    expect(message.prepare).toHaveBeenLastCalledWith({ payload: 'payload' }, { state: {} });
    expect(mockDispatch).toHaveBeenLastCalledWith({ payload: 'test', type: 'SEND_ENCRYPTED_MESSAGE_TEXT_MESSAGE' });
    expect(socket.getSocket().emit).toHaveBeenLastCalledWith('ENCRYPTED_MESSAGE', 'encryptedpayload');
  });

  it('should create an action to receive message', async () => {
    jest.spyOn(message, "process").mockImplementation(() => ({ payload: 'encrypted' }));

    await actions.receiveEncryptedMessage({ type: "TEXT_MESSAGE", payload: 'encrypted'  })(
        mockDispatch,
        jest.fn().mockReturnValue({ state: {} }),
    );

    expect(message.process).toHaveBeenLastCalledWith({type: "TEXT_MESSAGE", payload: 'encrypted' }, { state: {} });
    expect(mockDispatch).toHaveBeenLastCalledWith({
      payload: { payload: 'encrypted', state: { state: {} } },
      type: 'RECEIVE_ENCRYPTED_MESSAGE_TEXT_MESSAGE',
    });
  });
});
