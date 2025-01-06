import { INotificationFormatter, INotifier, Notification } from '@src/domain';
import { DiscordService } from './discord.service';

export class DiscordNotifier implements INotifier {
  constructor(
    private formatter: INotificationFormatter<string>,
    private discord: DiscordService,
  ) {}

  send(notification: Notification) {
    return this.discord.send(this.formatter.format(notification));
  }
}
