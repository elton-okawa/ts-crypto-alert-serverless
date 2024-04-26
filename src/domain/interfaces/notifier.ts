import { Notification } from '../notification';

export interface INotifier {
  send(notification: Notification): Promise<void>;
}

export const INotifier = Symbol('INotifier');
