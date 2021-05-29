import React from 'react';
import { io } from 'socket.io-client';

import './App.scss';
import Header from './components/Header';
import Body from './components/Body';
import WelcomeArea from './components/WelcomeArea';
import ChatArea from './components/ChatArea';

import { MESSAGES } from './data/enums/messages.enum';
import { Notification } from './data/models/notification.model';

// const url = process.env.NODE_ENV === 'test' ? '' : `/`;
// const socket = io(url, { transports: ['polling'] });
export default class App extends React.Component {

  socket: any;
  url = process.env.NODE_ENV === 'test' ? '' : `/`;

  title: MESSAGES | string = MESSAGES.TITLE;
  connected: boolean = false;
  name: string = '';
  messageOut: string = '';
  chat: any[] = [];
  typing: { message: string; enabled: boolean } = {
    message: '',
    enabled: false,
  };
  notification: Notification = { message: '', type: 'message' };
  hasAnyConnectionError: boolean = false;

  state = {
    title: this.title,
    connected: this.connected,
    name: this.name,
    messageOut: this.messageOut,
    chat: this.chat,
    typing: this.typing,
    notification: this.connected,
    hasAnyConnectionError: this.hasAnyConnectionError,
  };

  constructor(props: any) {
    super(props);
    this.socket = io(this.url, { transports: ['polling'] });
  }

  componentDidMount() {
    this.socket.on('message', ({ message, sender }: any) => {
      this.setState(
        {
          chat: [
            ...this.state.chat,
            {
              id: this.state.chat.length + 1,
              name: sender,
              message,
              type: 'message-in',
            },
          ],
        },
        () => this.resetTyping()
      );
    });

    this.socket.on('typing', (message: string) => {
      this.setState({
        typing: {
          enabled: true,
          message,
        },
      });
      setTimeout((): void => {
        this.resetTyping();
      }, 4000);
    });
  }

  resetTyping = (): void => {
    this.setState({
      typing: {
        enabled: false,
        message: '',
      },
    });
  };

  joinRoom = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    const { connected, name } = this.state;
    if (!connected) {
      this.socket.emit('join room', { name });
      this.socket.on('connection success', (success: string) => {
        this.setState({
          connected: true,
          title: MESSAGES.WELCOME + name,
          notification: {
            message: success,
            type: 'message',
          },
          chat: [
            ...this.state.chat,
            {
              id: this.state.chat.length + 1,
              message: success,
              type: 'notification',
            },
          ],
          hasAnyConnectionError: false,
        });
      });
      this.socket.on('connection error', (err: string) => {
        this.setState({
          connected: false,
          notification: {
            message: err,
            type: 'error',
          },
          hasAnyConnectionError: true,
        });
      });
    }
  };

  sendMessage = (e: Event) => {
    if (e) {
      e.preventDefault();
    }

    const { connected } = this.state;

    if (connected) {
      this.handleMessageOut();
    }
  };

  handleMessageOut = (): void => {
    const out = {
      id: this.state.chat.length + 1,
      name: this.state.name,
      message: this.state.messageOut,
      type: 'message-out',
    };
    this.socket.emit('send message', out);
    this.setState({
      chat: [...this.state.chat, out],
      messageOut: '',
    });
  };

  onNameChange = (e: Event): void => {
    const name = (e.target as HTMLTextAreaElement).value || '';
    this.setState({
      name,
    });
  };

  onMessageChange = (e: Event): void => {
    this.socket.emit('start typing', { name: this.state.name });
    const msg = (e.target as HTMLTextAreaElement).value || '';
    this.setState({
      messageOut: msg,
    });
  };

  render() {
    const { title, connected, hasAnyConnectionError, chat, typing, messageOut, notification, name } = this.state;
    return (
      <div className="App">
        <Header title={title}></Header>
        <Body>
          <WelcomeArea
            isVisible={!connected}
            name={name}
            onNameSubmit={this.joinRoom}
            onNameChange={this.onNameChange}
            hasAnyConnectionError={hasAnyConnectionError}
            notification={notification}></WelcomeArea>
          <ChatArea
            isVisible={connected}
            chat={chat}
            typing={typing}
            messageOut={messageOut}
            onMessageChange={this.onMessageChange}
            onMessageSend={this.sendMessage}></ChatArea>
        </Body>
      </div>
    );
  }
}
