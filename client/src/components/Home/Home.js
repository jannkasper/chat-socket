import React, { Component } from "react";
import shortId from 'shortid';
import { connect as connectSocket } from '../../utils/socket';
import Crypto from "../../utils/crypto";

const crypto = new Crypto();

class Home extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.messagesRef = React.createRef();
    }
    async componentWillMount() {
        this.roomId = encodeURI(this.props.match.params.roomId);
        const user = await this.createUser();

        const socket = connectSocket(this.roomId);
        this.socket = socket;

        socket.on('connect', () => {
            this.socket.emit('USER_ENTER', { publicKey: user.publicKey });
        });

        socket.on("ENCRYPTED_MESSAGE", payload => {
            this.props.receiveEncryptedMessage({
                type: 'TEXT_MESSAGE',
                payload
            })
        });

        socket.on("USER_ENTER", payload => {
            this.props.receiveUnencryptedMessage("USER_ENTER", payload);
            this.props.sendEncryptedMessage({
                type: "ADD_USER",
                payload: {
                    username: this.props.username,
                    publicKey: this.props.publicKey,
                    isOwner: this.props.iAmOwner,
                    id: this.props.userId,
                }
            })
        });

        socket.on("USER_EXIT", payload => {
            this.props.receiveUnencryptedMessage("USER_EXIT", payload);

        })

        socket.on("TOGGLE_LOCK_ROOM", payload => {
        });

        socket.on("ROOM_LOCKED", () => {
        })

        socket.on("disconnect", () => this.socket.disconnect())
    }

    createUser() {
        return new Promise(async resolve => {
            const username = shortId.generate();
            const encryptDecryptKeys = await crypto.createEncryptDecryptKeys();
            const exportedEncryptDecryptPrivateKey = await crypto.exportKey(encryptDecryptKeys.privateKey);
            const exportedEncryptDecryptPublicKey = await crypto.exportKey(encryptDecryptKeys.publicKey);

            this.props.createUser({
                username,
                publicKey: exportedEncryptDecryptPublicKey,
                privateKey: exportedEncryptDecryptPrivateKey,
            });

            resolve({
                username,
                publicKey: exportedEncryptDecryptPublicKey,
            })

        })
    }

    handleLock(e) {
        e.preventDefault();
        this.socket.emit('TOGGLE_LOCK_ROOM');
    };

    handleSendMessage(e) {
        e.preventDefault();
        if (this.inputRef.current.value) {
            this.props.sendEncryptedMessage({
                type: 'TEXT_MESSAGE',
                payload: {
                    text: this.inputRef.current.value,
                    timestamp: Date.now(),
                }
            })
            this.inputRef.current.value = "";
        }
    };

    render() {
        return (
            <div className="App">
                <ul ref={this.messagesRef}  id="messages">
                    {this.props.activities
                        .map(item => {
                            switch (item.type) {
                                case "TEXT_MESSAGE":
                                    return <li>{item.username} : {item.text}</li>
                                case "USER_ENTER":
                                    return <li style={{color: "green"}}>{item.username} joined</li>
                                case "USER_EXIT":
                                    return <li style={{color: "red"}}>{item.username} exit</li>
                                default:
                                    return null
                            }
                        })
                    }
                </ul>
                <form id="form" action="">
                    <input ref={this.inputRef} id="input" autoComplete="off"/>
                    <button onClick={e => this.handleSendMessage(e)}>Send</button>
                    <button onClick={e => this.handleLock(e)}>Lock room</button>
                </form>
            </div>
        );
    }

}

export default Home;
