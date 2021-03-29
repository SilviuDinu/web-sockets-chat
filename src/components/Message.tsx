import { useEffect, useRef } from 'react';

export default function Message(props: any) {
  const chatBoxRef = useRef<any>();

  const updateScrollPos = (): void => {
    chatBoxRef.current.scrollIntoView(true);
    document.querySelector<any>('.chat-area .chat-area-box').scrollTop += 10;
  };

  useEffect(() => {
    if (chatBoxRef && chatBoxRef.current) {
      updateScrollPos();
    }
  });

  return (
    <div className={props.type}>
      <div className="sender">{props.sender}</div>
      <div className="message">
        <span ref={chatBoxRef}>{props.message}</span>
      </div>
    </div>
  );
}
