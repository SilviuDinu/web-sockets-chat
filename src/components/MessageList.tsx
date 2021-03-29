import Message from './Message';

export default function MessageList(props: any) {
    return props.messages.length > 0 ? (
      <div className="message-list">
        {props.messages.map((item: any, index: number) => {
            return (
              <Message
                key={item.id || index}
                type={item.type}
                sender={item.name || null}
                message={item.message} />
              );
        })}
      </div>
    ): null;
  }