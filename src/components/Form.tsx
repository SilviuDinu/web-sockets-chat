export default function Form(props: any) {
  const { form } = props;
  return (
    <form
        onSubmit={props.onFormSubmit}
        className={form.class}
        method="POST">
        <input
            type="text"
            name="name"
            className={form.input.class}
            placeholder={form.input.placeholder}
            aria-label={form.input.ariaLabel}
            onChange={event => props.onInputChange(event)}
        />
        <button type="submit" className="button">
            {form.buttonText}
        </button>
    </form>
  );
}
