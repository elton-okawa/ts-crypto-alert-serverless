import { Notification } from '@src/domain/entities';

export interface INotificationFormatter<T> {
  format(notification: Notification): T;
}

export const INotificationFormatter = Symbol('INotificationFormatter');
