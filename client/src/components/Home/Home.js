import React, { Component } from "react";
import shortId from 'shortid';
import { X, AlertCircle } from 'react-feather';
import classNames from 'classnames';
import { connect as connectSocket } from '../../utils/socket';
import Crypto from "../../utils/crypto";

import styles from "./styles.module.scss"
import Nav from "../Nav";

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
            this.socket.emit('USER_ENTER', {publicKey: user.publicKey});
            this.props.toggleSocketConnected(true);
        });

        socket.on("disconnect", () => this.props.toggleSocketConnected(true));

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
            this.props.receiveUnencryptedMessage("TOGGLE_LOCK_ROOM", payload);
        });

        socket.on("ROOM_LOCKED", () => {
        })

        window.addEventListener('beforeunload', evt => {
            socket.emit('USER_DISCONNECT');
        });
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
            <div className={classNames(styles.styles, 'h-100')}>
                <div className="nav-container">
                    {!this.props.socketConnected && (
                        <div className="alert-banner">
                          <span className="icon">
                            <AlertCircle size="15" />
                          </span>{' '}
                          <span>Disconnected</span>
                        </div>
                    )}
                    <Nav
                        members={this.props.members}
                        roomId={this.props.roomId}
                        roomLocked={this.props.roomLocked}
                        toggleLockRoom={() => this.props.sendUnencryptedMessage('TOGGLE_LOCK_ROOM', undefined)}
                        // openModal={this.props.openModal}
                        iAmOwner={this.props.iAmOwner}
                        userId={this.props.userId}
                        // translations={this.props.translations}
                    />
                </div>


                <ul ref={this.messagesRef}  id="messages" className="main-chat">
                    {this.props.activities
                        .map(item => {
                            switch (item.type) {
                                case "TEXT_MESSAGE":
                                    return <li>{item.username} : {item.text}</li>
                                case "USER_ENTER":
                                    return <li style={{color: "green"}}>{item.username} joined</li>
                                case "USER_EXIT":
                                    return <li style={{color: "red"}}>{item.username} exit</li>
                                case "TOGGLE_LOCK_ROOM":
                                    return <li style={{color: "red"}}>{item.username} {item.locked ? "locked the room" : "unlocked the room"}</li>
                                default:
                                    return null
                            }
                        })
                    }
                </ul>
                <form id="form" action="">
                    <input ref={this.inputRef} id="input" autoComplete="off"/>
                    <button onClick={e => this.handleSendMessage(e)}>Send</button>
                </form>
            </div>
        );
    }

}

export default Home;
