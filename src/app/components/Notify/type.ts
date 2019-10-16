export enum NotificationType {
  'DEFAULT' = 'default',
  'PRIMARY' = 'primary',
  'WARNING' = 'warning',
  'DANGER' = 'danger',
}

export type Notification = {
  id: symbol;
  message: string;
  dismissable?: boolean;
  type?: NotificationType;
};
