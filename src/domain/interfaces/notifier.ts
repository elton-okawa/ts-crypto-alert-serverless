import { Notification } from '../notification';

export interface INotifier {
  send(notification: Notification);
}

export const INotifier = Symbol('INotifier');
