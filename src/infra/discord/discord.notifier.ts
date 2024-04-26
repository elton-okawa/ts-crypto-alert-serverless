import { INotifier, Notification } from '@src/domain';
import { DiscordService } from './discord.service';
import { DiscordMessageFormatter } from './discord-message.formatter';

export class DiscordNotifier implements INotifier {
  constructor(
    private formatter: DiscordMessageFormatter,
    private discord: DiscordService,
  ) {}

  send(notification: Notification) {
    return this.discord.send(this.formatter.format(notification));
  }
}
