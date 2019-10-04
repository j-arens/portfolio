import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Result, ok, err, match } from '~common/result';
import Spinner from '../Spinner';
const s = require('./style.pcss');

type Values = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const submitForm = async (values: Values): Promise<Result<null, string>> => {
  try {
    const res = await fetch(`${process.env.CONTACT_SUBMISSION_URL}`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      // if validation error do something
      // else
      return err(
        `An unexpected error occured. Try sending me an email at ${process.env.CONTACT_EMAIL}`,
      );
    }
    return ok(null);
  } catch (e) {
    return err(
      `Unable to connect to server. Try sending me an email at ${process.env.CONTACT_EMAIL}`,
    );
  }
};

const ContactForm = (): h.JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [edited, setEdited] = useState<Set<string>>(new Set());
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const getInputClasses = (name: string): string => {
    const classes = [s.input];
    if (!edited.has(name)) {
      // the :invalid css state selector is cool but
      // is applied by default on page load before the user
      // has even had a chance to fill out the form, this is
      // an attempt to workaround that issue by applying some
      // overriding css to inputs that have not yet been "edited"
      classes.push(s['hide-invalid']);
    }
    return classes.join(' ');
  };

  const handleChange = <K extends keyof Values>(
    key: K,
  ): ((e: Event) => void) => (e): void => {
    if (e && e.currentTarget instanceof HTMLInputElement) {
      setValues({
        ...values,
        [key]: e.currentTarget.value,
      });
    }
  };

  const handleBlur = <K extends keyof Values>(key: K) => (): void => {
    if (!edited.has(key)) {
      setEdited(new Set([...edited, key]));
    }
  };

  const handleSubmit = (e: Event): void => {
    setSubmitting(true);
    e.preventDefault();
    submitForm(values).then((result: Result<null, string>) => {
      setSubmitting(false);
      match<null, string>({
        result,
        ok: () => {},
        err: (err: string) => {},
      });
    });
  };

  return (
    <form class={s.form} action="#" method="post" onSubmit={handleSubmit}>
      <h2 class={s.title}>Get in touch</h2>
      <div class={s.group}>
        <label class={s.label} htmlFor="name">
          Name
        </label>
        <input
          class={getInputClasses('name')}
          name="name"
          type="text"
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          required
        />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="email">
          Email
        </label>
        <input
          class={getInputClasses('email')}
          name="email"
          type="email"
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          required
        />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="subject">
          Subject
        </label>
        <input
          class={getInputClasses('subject')}
          name="subject"
          type="text"
          onChange={handleChange('subject')}
          onBlur={handleBlur('subject')}
          required
        />
      </div>
      <div class={s.group}>
        <label class={s.label} htmlFor="message">
          Message
        </label>
        <textarea
          class={getInputClasses('message')}
          name="message"
          cols={30}
          rows={10}
          onChange={handleChange('message')}
          onBlur={handleBlur('message')}
          required
        />
      </div>
      <div class={s.group}>
        <button
          class={s.submit}
          type="submit"
          // removes overriding css that hides :invalid before user edits an input,
          // doing this here instead of in the submit handler because the submit event
          // is not fired on forms that have invalid fields
          onClick={(): void => setEdited(new Set(Object.keys(values)))}
        >
          {submitting ? <Spinner /> : 'submit'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
