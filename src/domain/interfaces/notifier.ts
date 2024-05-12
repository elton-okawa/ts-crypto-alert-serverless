import { Notification } from '@src/domain/entities';

export interface INotifier {
  send(notification: Notification): Promise<void>;
}

export const INotifier = Symbol('INotifier');
