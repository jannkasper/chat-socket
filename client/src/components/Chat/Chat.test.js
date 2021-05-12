import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Chat } from './Chat';

const translations = {
  typePlaceholder: 'inputplaceholder',
};

describe('Chat component', () => {

  beforeEach(() => {
    // Fake date
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2020-03-14T11:01:58.135Z').valueOf());
  })

  it('should display', () => {
    const {asFragment} = render(
        <Chat
            scrollToBottom={() => {}}
            // focusChat={false}
            // userId="foo"
            // username="user"
            // showNotice={() => {
            // }}
            // clearActivities={() => {
            // }}
            sendEncryptedMessage={() => {}}
            translations={{}}
        />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('can send message', () => {
    const sendEncryptedMessage = jest.fn();

    render(
        <Chat
            scrollToBottom={() => {
            }}
            // focusChat={false}
            // userId="foo"
            // username="user"
            // showNotice={() => {}}
            // clearActivities={() => {}}
            sendEncryptedMessage={sendEncryptedMessage}
            translations={translations}
        />,
    );

    const textarea = screen.getByPlaceholderText(translations.typePlaceholder);

    // Validate but without text
    fireEvent.keyDown(textarea, {key: 'Enter'});

    expect(sendEncryptedMessage).not.toHaveBeenCalled();

    // Type test
    fireEvent.change(textarea, {target: {value: 'test'}});
    // Validate
    fireEvent.keyDown(textarea, {key: 'Enter'});

    expect(sendEncryptedMessage).toHaveBeenLastCalledWith({
      payload: {text: 'test', timestamp: 1584183718135},
      type: 'TEXT_MESSAGE',
    });

    // Validate (textarea should be empty)
    fireEvent.keyDown(textarea, {key: 'Enter'});

    expect(sendEncryptedMessage).toHaveBeenCalledTimes(1);
  });

  it("shouldn't send message with Shift+enter", () => {
    const sendEncryptedMessage = jest.fn();

    render(
        <Chat
            scrollToBottom={() => {
            }}
            // focusChat={false}
            // userId="foo"
            // username="user"
            // showNotice={() => {}}
            // clearActivities={() => {}}
            sendEncryptedMessage={sendEncryptedMessage}
            translations={translations}
        />,
    );

    const textarea = screen.getByPlaceholderText(translations.typePlaceholder);

    // Test shift effect
    fireEvent.change(textarea, {target: {value: 'test2'}});
    fireEvent.keyDown(textarea, {key: 'Shift'});
    fireEvent.keyDown(textarea, {key: 'Enter'});
    fireEvent.keyUp(textarea, {key: 'Shift'});

    expect(sendEncryptedMessage).toHaveBeenCalledTimes(0);

    // Now we want to send the message
    fireEvent.keyDown(textarea, {key: 'Enter'});

    expect(sendEncryptedMessage).toHaveBeenCalledTimes(1);

    expect(sendEncryptedMessage).toHaveBeenLastCalledWith({
      payload: {text: 'test2', timestamp: 1584183718135},
      type: 'TEXT_MESSAGE',
    });
  });

});
