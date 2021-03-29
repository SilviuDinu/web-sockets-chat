import MessageList from './MessageList';
import Notification from './Notification';
import Form from './Form';

export default function ChatArea(props: any) {

  const form = {
    input: {
      placeholder: 'Write a message ...',
      ariaLabel: 'Enter message to send',
      class: 'chat-area-form-input',
    },
    buttonText: 'Send',
    class: 'chat-area-form',
  };

  const onInputChange = (e: Event) => {
    props.onMessageChange(e);
  };

  const onFormSubmit = (e: Event) => {
    props.onMessageSend(e);
  };

  return props.isVisible ? (
    <div className="chat-area">
      <div className="chat-area-box">
        <MessageList messages={props.chat} />
        {props.typing.enabled ? <Notification
          type="temporary"
          elem="span"
          message={props.typing.message} /> : null }
      </div>
      <div className="chat-area-form-wrapper">
        <Form
            form={form}
            inputValue={props.messageOut}
            onInputChange={onInputChange}
            onFormSubmit={onFormSubmit}>
        </Form>
      </div>
    </div>
  ) : null;
}
