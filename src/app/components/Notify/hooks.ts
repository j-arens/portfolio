import { useState } from 'preact/hooks';
import { Notification } from './';

type NewNotification = Omit<Notification, 'id'>;

type NotificationsState = Map<symbol, Notification>;

export function useNotifications(
  initialState: NotificationsState = new Map(),
): [NotificationsState, (n: NewNotification) => void, (id: symbol) => void] {
  const [state, setState] = useState(initialState);
  const add = (notification: NewNotification): void => {
    const id = Symbol();
    const newState = new Map(state);
    newState.set(id, {
      ...notification,
      id,
    });
    setState(newState);
  };
  const remove = (id: symbol): void => {
    const newState = new Map(state);
    newState.delete(id);
    setState(newState);
  };
  return [state, add, remove];
}
