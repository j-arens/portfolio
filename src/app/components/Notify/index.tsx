import { h } from 'preact';
const s = require('./style.pcss');

export enum NotificationType {
  'DEFAULT' = 'default',
  'WARNING' = 'warning',
  'DANGER' = 'danger',
  'SUCCESS' = 'success',
}

export type Notification = {
  id: symbol;
  message: string;
  dismissable?: boolean;
  type?: NotificationType;
};

type Props = {
  notifications: Notification[];
  onDismiss: (id: symbol) => void;
  className?: string;
};

const Notify = ({
  notifications,
  onDismiss,
  className = '',
}: Props): h.JSX.Element | null => {
  if (!notifications.length) {
    return null;
  }
  return (
    <ul class={[s.notify, className].join(' ')}>
      {notifications.map(({ id, message, type, dismissable }) => (
        <li
          key={id}
          class={[
            s.notification,
            type ? s[`notification--${type}`] : s['notification--default'],
          ].join(' ')}
        >
          <p class={s.message}>{message}</p>
          {dismissable ? (
            <button class={s.btn} onClick={(): void => onDismiss(id)}>
              <svg
                class={s.btnIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default Notify;
