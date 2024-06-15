import { INotifier } from '@src/domain';
import { DiscordByPeriodFormatter } from './discord-by-period.formatter';
import { discordConfig } from './discord.config';
import { DiscordService } from './discord.service';
import { DiscordNotifier } from './discord.notifier';

export type { DiscordService } from './discord.service';
export type { DiscordByPeriodFormatter as DiscordMessageFormatter } from './discord-by-period.formatter';
export type { DiscordNotifier } from './discord.notifier';

export const discordService = new DiscordService(discordConfig);
export const discordMessageFormatter = new DiscordByPeriodFormatter();
export const discordNotifier: INotifier = new DiscordNotifier(
  discordMessageFormatter,
  discordService,
);
