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
