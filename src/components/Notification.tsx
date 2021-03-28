export default function Notification(props: any) {
    return (
      <div className={props.type}>
          <props.elem>{props.message}</props.elem>
      </div>
    );
  }