import { Notification } from '@src/domain/entities';

export interface INotificationFormatter {
  format(notification: Notification): string;
}

export const INotificationFormatter = Symbol('INotificationFormatter');
