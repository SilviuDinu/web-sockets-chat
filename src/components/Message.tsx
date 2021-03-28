export default function Message(props: any) {
    return (
      <div className={props.type}>
          <span>{props.message}</span>
      </div>
    );
  }