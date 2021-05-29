import React, { Component, ReactComponentElement, useState } from 'react';
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
import { configure, EnzymeAdapter, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

configure({ adapter: new Adapter() });

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

describe('it should test the state', () => {
  let component: any;
  let instance: any;
  beforeEach(() => {
    component = shallow(<App />);
    instance = component.instance();
  });
  it('should have a defined state', () => {
    expect(component.state).toBeDefined();
  });
  it('state should have a defined title', () => {
    expect(component.state('title')).toBe(MESSAGES.TITLE);
  });
  it('should reset typing', () => {
    jest.spyOn(instance, 'setState');
    instance.resetTyping();
    expect(instance.setState).toHaveBeenCalled();
  });
  it('should join room', () => {
    jest.spyOn(instance, 'setState');
    jest.spyOn(instance['socket'], 'emit').mockImplementation(() => {});
    jest.spyOn(instance['socket'], 'on');
    instance.joinRoom({ preventDefault: () => {}, target: { value: 'Send' } });;
    expect(instance['socket'].emit).toHaveBeenCalled();
    expect(instance['socket'].on).toHaveBeenCalled();
  });
  it('should test sendMessage function', () => {
    jest.spyOn(instance, 'handleMessageOut').mockImplementation(() => { });
    const event = { preventDefault: () => {}, target: { value: 'Send' } };
    const eventSpy = jest.spyOn(event, 'preventDefault');
    instance.state['connected'] = true;
    instance.sendMessage(event);
    expect(eventSpy).toHaveBeenCalled();
    expect(instance.handleMessageOut).toHaveBeenCalled();
  });
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
