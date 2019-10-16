import { useReducer } from 'preact/hooks';
import { Action } from '~app/type';
import { Notification } from './type';

type NotificationsState = Map<symbol, Notification>;

enum NotificationActionTypes {
  'ADD' = 'add',
  'DELETE' = 'delete',
}

type NewNotification = Omit<Notification, 'id'>;

export const addNotification = (
  notification: NewNotification,
): Action<NotificationActionTypes.ADD, NewNotification> => ({
  type: NotificationActionTypes.ADD,
  payload: notification,
});

export const deleteNotification = (
  id: symbol,
): Action<NotificationActionTypes.DELETE, symbol> => ({
  type: NotificationActionTypes.DELETE,
  payload: id,
});

type AnyNotificationAction =
  | ReturnType<typeof addNotification>
  | ReturnType<typeof deleteNotification>;

const reducer = (
  state: NotificationsState,
  action: AnyNotificationAction,
): NotificationsState => {
  switch (action.type) {
    case NotificationActionTypes.ADD: {
      const id = Symbol();
      const newState = new Map(state);
      newState.set(id, {
        id,
        ...action.payload,
      });
      return newState;
    }
    case NotificationActionTypes.DELETE: {
      const newState = new Map(state);
      newState.delete(action.payload);
      return newState;
    }
    default: {
      return state;
    }
  }
};

export function useNotifications(
  initialState = new Map(),
): [
  NotificationsState,
  (notification: NewNotification) => void,
  (id: symbol) => void,
] {
  const [state, dispatch] = useReducer<
    NotificationsState,
    AnyNotificationAction
  >(reducer, initialState);
  const add = (notification: NewNotification): void =>
    dispatch(addNotification(notification));
  const remove = (id: symbol): void => dispatch(deleteNotification(id));
  return [state, add, remove];
}
