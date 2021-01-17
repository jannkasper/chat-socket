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
            this.socket.emit('USER_ENTER', { username: user.username, publicKey: user.publicKey });
        });

        socket.on("MESSAGE", payload => {
            const item = document.createElement('li');
            item.textContent = `${payload.username} : ${payload.text}`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on("USER_ENTER", payload => {
            this.props.receiveUnencryptedMessage("USER_ENTER", payload);

            const item = document.createElement('li');
            item.style.color = "green";
            item.textContent = `${payload.users?.slice(-1)[0].username} joined chat`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on("USER_EXIT", payload => {
            this.props.receiveUnencryptedMessage("USER_EXIT", payload);
            const item = document.createElement('li');
            item.style.color = "red";
            item.textContent = `${payload.exitUser?.username} exit chat`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on("TOGGLE_LOCK_ROOM", payload => {
            const item = document.createElement('li');
            item.style.color = "red";
            item.textContent = `ROOM LOCKED: ${payload.isLocked}`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on("ROOM_LOCKED", () => {
            const item = document.createElement('li');
            item.style.color = "red";
            item.textContent = `ROOM LOCKED`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
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

    handleClick(e) {
        e.preventDefault();
        if (this.inputRef.current.value) {
            this.socket.emit('MESSAGE', {username: this.props.username, text: this.inputRef.current.value});
            this.inputRef.current.value = "";
        }
    };

    render() {
        return (
            <div className="App">
                <ul ref={this.messagesRef}  id="messages"></ul>
                <form id="form" action="">
                    <input ref={this.inputRef} id="input" autoComplete="off"/>
                    <button onClick={e => this.handleClick(e)}>Send</button>
                    <button onClick={e => this.handleLock(e)}>Lock room</button>
                </form>
            </div>
        );
    }

}

export default Home;
