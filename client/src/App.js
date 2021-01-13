import React, { useState, useEffect, useRef} from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

function App() {
    const inputRef = useRef();
    const messagesRef = useRef();
    const socket = socketIOClient(ENDPOINT);

     const handleClick = function(e) {
        e.preventDefault();
        if (inputRef.current.value) {
            socket.emit('chat message', inputRef.current.value);
            inputRef.current.value = "";
        }
    };

  useEffect(() => {
      socket.on("chat message", msg => {
          console.log("RETURN: ", msg)
          const item = document.createElement('li');
          item.textContent = msg;
          messagesRef.current.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
      });

  // CLEAN UP THE EFFECT
  return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <ul ref={messagesRef}  id="messages"></ul>
      <form id="form" action="">
        <input ref={inputRef} id="input" autoComplete="off"/>
        <button onClick={e => handleClick(e)}>Send</button>
      </form>
    </div>
  );
}

export default App;
