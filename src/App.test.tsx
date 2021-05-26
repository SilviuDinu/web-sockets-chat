import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { io } from 'socket.io-client';
import App from './App';
import { MESSAGES } from './data/enums/messages.enum';
import WelcomeArea from './components/WelcomeArea';
import MessageList from './components/MessageList';
import Message from './components/Message';
import ChatArea from './components/ChatArea';
import Header from './components/Header';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

const MessageMock = (props: any) => {
  return (
    <div className={props.type}>
      <div className="sender">{props.sender}</div>
      <div className="message">
        <span>{props.message}</span>
      </div>
    </div>
  );
};

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

jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn();
  const socket = { emit, on };
  return jest.fn(() => socket);
});

