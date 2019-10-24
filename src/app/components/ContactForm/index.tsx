import { h, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Result, match } from '~common/result';
import { useNotifications } from '~app/hooks';
import Spinner from '../Spinner';
import Notify, { NotificationType } from '../Notify';
import submit from './submission';
const s = require('./style.pcss');

export type Values = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactForm: FunctionComponent<{}> = () => {
  const [
    notifications,
    addNotification,
    deleteNotification,
  ] = useNotifications();
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
    if (!submitting && e.currentTarget) {
      setValues({
        ...values,
        [key]: (e.currentTarget as HTMLInputElement).value,
      });
    }
  };

  const handleBlur = <K extends keyof Values>(key: K) => (): void => {
    if (!submitting && !edited.has(key)) {
      setEdited(new Set([...edited, key]));
    }
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    if (submitting) {
      return;
    }
    setSubmitting(true);
    submit(values).then((result: Result<null, string>) => {
      setSubmitting(false);
      match<null, string>({
        result,
        ok: () => {
          addNotification({
            message: "thanks, I'll be in contact shortly!",
            dismissable: true,
            type: NotificationType.SUCCESS,
          });
          setValues({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        },
        err: (err: string) => {
          addNotification({
            message: err,
            dismissable: true,
            type: NotificationType.DANGER,
          });
        },
      });
    });
  };

  return (
    <div class={[s.container, submitting ? s.submitting : ''].join(' ')}>
      <Notify
        className={s.notifications}
        notifications={Array.from(notifications.values())}
        onDismiss={deleteNotification}
      />
      <form
        class={s.form}
        action="/contact"
        method="post"
        onSubmit={handleSubmit}
      >
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
            disabled={submitting}
            // removes overriding css that hides :invalid before user edits an input,
            // doing this here instead of in the submit handler because the submit event
            // is not fired on forms that have invalid fields
            onClick={(): void => setEdited(new Set(Object.keys(values)))}
          >
            {submitting ? <Spinner className={s.submitSpinner} /> : 'submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
