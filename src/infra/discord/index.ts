import { INotifier } from '@src/domain';
import { DiscordMessageFormatter } from './discord-message.formatter';
import { discordConfig } from './discord.config';
import { DiscordService } from './discord.service';
import { DiscordNotifier } from './discord.notifier';

export type { DiscordService } from './discord.service';
export type { DiscordMessageFormatter } from './discord-message.formatter';
export type { DiscordNotifier } from './discord.notifier';

export const discordService = new DiscordService(discordConfig);
export const discordMessageFormatter = new DiscordMessageFormatter();
export const discordNotifier: INotifier = new DiscordNotifier(
  discordMessageFormatter,
  discordService,
);
