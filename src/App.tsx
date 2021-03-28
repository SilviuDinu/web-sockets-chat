import { useState } from "react";
import { io } from "socket.io-client";
import "./App.scss";
import Header from "./components/Header";
import Body from "./components/Body";
import WelcomeArea from "./components/WelcomeArea";
import ChatArea from "./components/ChatArea";
import { MESSAGES } from "./data/enums/messages.enum";

const socket = io("/", { transports: ["polling"] });

function App() {
  const [title, setTitle] = useState(MESSAGES.TITLE);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState('');
  const [messageOut, setMessageOut] = useState('');
  const [messageIn, setMessageIn] = useState('');
  const [notification, setNotification] = useState({message: '', type: 'message'});
  const [hasAnyConnectionError, setHasAnyConnectionError] = useState(false);

  const joinRoom = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    if (!connected) {
      socket.emit('join room', { name });
      socket.on('connection success', (success: string) => {
        setConnected(true);
        setNotification({
          message: success,
          type: 'message'
        });
        setHasAnyConnectionError(false);
      });
      socket.on('connection error', (err: string) => {
        setConnected(false);
        setNotification({
          message: err,
          type: 'error'
        });
        setHasAnyConnectionError(true);
      });
    }
    socket.on('message', (msg: string) => setMessageIn(msg));
  };

  const sendMessage = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    if (connected) {
      socket.emit('send message', { name, message: messageOut })
    }
  }

  const onNameChange = (e: Event) => {
    setName((e.target as HTMLTextAreaElement).value || '');
  }

  const onMessageChange = (e: Event) => {
    setMessageOut((e.target as HTMLTextAreaElement).value || '');
  }

  return (
    <div className="App">
      <Header title={title}></Header>
      <Body>
        <WelcomeArea
          isVisible={!connected}
          onNameSubmit={joinRoom}
          onNameChange={onNameChange}
          hasAnyConnectionError={hasAnyConnectionError}
          notification={notification}>  
        </WelcomeArea>
        <ChatArea
          isVisible={connected}
          message={messageIn}
          messageOut={messageOut}
          onMessageChange={onMessageChange}
          onMessageSend={sendMessage}>
        </ChatArea>
      </Body>
    </div>
  );
}

export default App;
