import { h } from 'preact';
const s = require('./style.pcss');

const ContactForm = (): h.JSX.Element => {
  return (
    <form action="" class={s.form}>
      <h2 class={s.title}>Get in touch</h2>
      <div class={s.group}>
        <label class={s.label} htmlFor="name">
          Name
        </label>
        <input class={s.input} name="name" type="text" />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="email">
          Email
        </label>
        <input class={s.input} name="email" type="email" />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="subject">
          Subject
        </label>
        <input class={s.input} name="subject" type="text" />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="message">
          Message
        </label>
        <textarea class={s.input} name="message" cols={30} rows={10} />
      </div>
      <div class={s.group}>
        <button class={s.submit} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
