import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { MESSAGES } from './data/enums/messages.enum';
import WelcomeArea from './components/WelcomeArea';
import MessageList from './components/MessageList';
import Message from './components/Message';
import Body from './components/Body';
import ChatArea from './components/ChatArea';
import Header from './components/Header';
import renderer from 'react-test-renderer';
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

// jest.mock('socket.io-client');

test(`renders Silviu's Chat Application`, () => {
  render(<App />);
  const linkElement = screen.getByText(/Silviu's Chat Application/i);
  expect(linkElement).toBeInTheDocument();
});

test(`renders Header`, () => {
  const title = MESSAGES.WELCOME + 'William';
  render(<Header title={title} />);
  const welcomeMessage = screen.getByText('Welcome, William');
  expect(welcomeMessage).toBeInTheDocument();
});

test(`renders Welcome Area`, () => {
  const component = renderer.create(
    <WelcomeArea
      isVisible={true}
      name={'William'}
      onNameSubmit={() => {}}
      onNameChange={() => {}}
      hasAnyConnectionError={true}
      notification={'eroare'}></WelcomeArea>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test(`renders Chat Area`, () => {
  const component = renderer.create(
    <ChatArea
      isVisible={true}
      chat={[
        {
          id: 0,
          message: 'William has joined the chat',
          type: 'notification',
        },
        {
          id: 1,
          message: 'John has joined the chat',
          type: 'notification',
        },
      ]}
      typing={false}
      messageOut={'Salut'}
      onMessageChange={() => {}}
      onMessageSend={() => {}}></ChatArea>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test(`test MessageList`, () => {
  const component = renderer.create(
    <MessageList
      messages={[
        {
          id: 0,
          message: 'Salut',
          type: 'message-in',
        },
      ]}></MessageList>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test(`test Message`, () => {
  window.HTMLElement.prototype.scrollIntoView = function () {
    document.querySelector<any>('body').scrollTop += 10;
  };

  render(
    <MessageList
      messages={[
        {
          id: 0,
          message: 'Salut',
          type: 'message-in',
        },
      ]}></MessageList>
  );
  const msg = screen.getByText(/Salut/i);
  expect(msg).toBeInTheDocument();
});

describe('socket backend', () => {
  let io: any, serverSocket: any, clientSocket: any;

  beforeAll(done => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket: any) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should work to send and receive messages', done => {
    clientSocket.on('message', (req: any) => {
      expect(req.message).toBe('Salut');
      done();
    });
    serverSocket.emit('message', { message: 'Salut' });
  });
});

// describe('my socket backend', () => {
//   let io: any, clientSocket: any;

//   beforeAll(done => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     httpServer.listen(() => {
//       clientSocket = new Client(`http://localhost:1337/`);
//     });
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.close();
//   });

//   test('should test backend events', done => {
//     clientSocket.emit('join room', { name: 'Benedict' });
//     jest.setTimeout(6000);
//     done();
//     clientSocket.on('connection success', async (arg: any) => {
//       expect(arg).toBe(`Benedict joined the chat!`);
//       done();
//     });
//   });
// });
