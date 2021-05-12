import React, { Component } from "react";

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            shiftKeyDown: false,
        };
    }

    componentDidMount() {
        // Disable for now due to vary issues:
        // Paste not working, shift+enter line breaks
        // autosize(this.textInput);
        this.textInput.addEventListener('autosize:resized', () => {
            this.props.scrollToBottom();
        });

    }

    handleFormSubmit(evt) {
        evt.preventDefault();
        this.sendMessage();
    }

    canSend() {
        return this.state.message.trim().length;
    }

    sendMessage() {
        if (!this.canSend()) {
            return;
        }

        const { message } = this.state;
        // const isCommand = this.parseCommand(message);

        // if (isCommand) {
        //     const res = this.executeCommand(isCommand);
        //     if (res === false) {
        //         return;
        //     }
        // } else {
        //     this.props.sendEncryptedMessage({
        //         type: 'TEXT_MESSAGE',
        //         payload: {
        //             text: message,
        //             timestamp: Date.now(),
        //         },
        //     });
        // }

        this.props.sendEncryptedMessage({
            type: 'TEXT_MESSAGE',
            payload: {
                text: message,
                timestamp: Date.now(),
            },
        });

        this.setState({
            message: '',
        });
    }

    handleInputChange(evt) {
        this.setState({
            message: evt.target.value,
        });
    }

    handleKeyUp(e) {
        if (e.key === 'Shift') {
            this.setState({
                shiftKeyDown: false,
            });
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Shift') {
            this.setState({
                shiftKeyDown: true,
            });
        }
        // Fix when autosize is enabled - line breaks require shift+enter twice
        if (e.key === 'Enter' && !this.state.shiftKeyDown) {
            e.preventDefault();
            if (this.canSend()) {
                this.sendMessage();
            } else {
                this.setState({
                    message: '',
                });
            }
        }
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit.bind(this)} className="chat-preflight-container">
                <textarea
                    rows="1"
                    onKeyUp={this.handleKeyUp.bind(this)}
                    onKeyDown={this.handleKeyPress.bind(this)}
                    ref={input => {
                        this.textInput = input;
                    }}
                    autoFocus
                    className="chat"
                    value={this.state.message}
                    placeholder={this.props.translations?.typePlaceholder}
                    onChange={this.handleInputChange.bind(this)}
                />
            </form>
            )
    }
}

export default Chat
