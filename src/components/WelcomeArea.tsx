import Notification from './Notification';
import Form from './Form';

export default function WecomeArea(props: any) {
  const form = {
    input: {
      placeholder: 'Please enter your name...',
      ariaLabel: 'Enter a name to be used in the chat room',
      class: 'welcome-area-form-input',
    },
    buttonText: 'Send',
    class: "welcome-area-form"
  };

  const onInputChange = (e: Event) => {
    props.onNameChange(e);
  }

  const onFormSubmit = (e: Event) => {
      props.onNameSubmit(e);
  }

  return props.isVisible ? (
    <>
      <div className="welcome-area">
        <Form
            form={form}
            onInputChange={onInputChange}
            onFormSubmit={onFormSubmit}>
        </Form>
      </div>
      {props.hasAnyConnectionError ? <Notification type="error" elem="p" message={props.notification.message} /> : null}
    </>
  ) : null;
}
