import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import './App.scss';
import Header from './components/Header';
import Body from './components/Body';
import WelcomeArea from './components/WelcomeArea';
import ChatArea from './components/ChatArea';

import { MESSAGES } from './data/enums/messages.enum';
import { Notification } from './data/models/notification.model';

const url= process.env.NODE_ENV==='test'?'':`/`;
const socket = io(url, { transports: ['polling'] });

function App() {
  const [title, setTitle] = useState<MESSAGES | string>(MESSAGES.TITLE);
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [messageOut, setMessageOut] = useState<string>('');
  const [chat, setChat] = useState<any[]>([]);
  const [typing, setTyping] = useState<{ message: string; enabled: boolean }>({
    message: '',
    enabled: false,
  });
  const [notification, setNotification] = useState<Notification>({ message: '', type: 'message' });
  const [hasAnyConnectionError, setHasAnyConnectionError] = useState<boolean>(false);

  useEffect(() => {
    socket.on('message', ({ message, sender }: any) => {
      setChat(chat => [
        ...chat,
        {
          id: chat.length + 1,
          name: sender,
          message,
          type: 'message-in',
        },
      ]);
      resetTyping();
    });

    socket.on('typing', (message: string) => {
      setTyping({
        enabled: true,
        message,
      });
      setTimeout((): void => {
        resetTyping();
      }, 4000);
    });
  }, []);

  const joinRoom = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    if (!connected) {
      socket.emit('join room', { name });
      socket.on('connection success', (success: string) => {
        setConnected(true);
        setTitle(MESSAGES.WELCOME + name);
        setNotification({
          message: success,
          type: 'message',
        });
        setChat(chat => [
          ...chat,
          {
            id: chat.length + 1,
            message: success,
            type: 'notification',
          },
        ]);
        setHasAnyConnectionError(false);
      });
      socket.on('connection error', (err: string) => {
        setConnected(false);
        setNotification({
          message: err,
          type: 'error',
        });
        setHasAnyConnectionError(true);
      });
    }
  };

  const resetTyping = (): void => {
    setTyping({
      enabled: false,
      message: '',
    });
  };

  const sendMessage = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    if (connected) {
      handleMessageOut();
    }
  };

  const handleMessageOut = (): void => {
    const out = {
      id: chat.length + 1,
      name,
      message: messageOut,
      type: 'message-out',
    };
    socket.emit('send message', out);
    setChat([...chat, out]);
    setMessageOut('');
  };

  const onNameChange = (e: Event): void => {
    setName((e.target as HTMLTextAreaElement).value || '');
  };

  const onMessageChange = (e: Event): void => {
    socket.emit('start typing', { name });
    setMessageOut((e.target as HTMLTextAreaElement).value || '');
  };

  return (
    <div className="App">
      <Header title={title}></Header>
      <Body>
        <WelcomeArea
          isVisible={!connected}
          name={name}
          onNameSubmit={joinRoom}
          onNameChange={onNameChange}
          hasAnyConnectionError={hasAnyConnectionError}
          notification={notification}></WelcomeArea>
        <ChatArea
          isVisible={connected}
          chat={chat}
          typing={typing}
          messageOut={messageOut}
          onMessageChange={onMessageChange}
          onMessageSend={sendMessage}></ChatArea>
      </Body>
    </div>
  );
}

export default App;
