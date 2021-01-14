import React, { Component } from "react";
import shortId from 'shortid';
import { connect as connectSocket } from '../../utils/socket';

class Home extends Component {
    constructor(props) {
        super(props);
        this.username = shortId.generate();
        this.roomId = encodeURI(this.props.match.params.roomId);

        this.inputRef = React.createRef();
        this.messagesRef = React.createRef();
    }
    async componentWillMount() {

        const socket = connectSocket(this.roomId);
        this.socket = socket;

        if (this.socket && this.roomId) {
            socket.emit("join", this.roomId);
        }

        socket.on("chat message", msg => {
            const item = document.createElement('li');
            item.textContent = `${msg.username} : ${msg.text}`;
            this.messagesRef.current.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on("disconnect", () => this.socket.disconnect())
    }


    handleClick(e) {
        e.preventDefault();
        if (this.inputRef.current.value) {
            this.socket.emit('chat message', {username: this.username, text: this.inputRef.current.value, roomId: this.roomId});
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
                </form>
            </div>
        );
    }

}

export default Home;
