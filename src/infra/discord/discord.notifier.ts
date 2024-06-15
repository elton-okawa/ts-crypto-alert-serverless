import { INotifier, Notification } from '@src/domain';
import { DiscordService } from './discord.service';
import { DiscordByPeriodFormatter } from './discord-by-period.formatter';

export class DiscordNotifier implements INotifier {
  constructor(
    private formatter: DiscordByPeriodFormatter,
    private discord: DiscordService,
  ) {}

  send(notification: Notification) {
    return this.discord.send(this.formatter.format(notification));
  }
}
