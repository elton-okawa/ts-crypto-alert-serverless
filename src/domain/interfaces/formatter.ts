import { Notification } from '../notification';

export interface INotificationFormatter {
  format(notification: Notification): string;
}

export const INotificationFormatter = Symbol('INotificationFormatter');
