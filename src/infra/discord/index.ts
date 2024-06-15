import { INotifier } from '@src/domain';
import { discordConfig } from './discord.config';
import { DiscordService } from './discord.service';
import { DiscordNotifier } from './discord.notifier';
import { DiscordByCryptoFormatter } from './discord-by-crypto.formatter';

export type { DiscordService } from './discord.service';
export type { DiscordByPeriodFormatter } from './discord-by-period.formatter';
export type { DiscordByCryptoFormatter } from './discord-by-crypto.formatter';
export type { DiscordNotifier } from './discord.notifier';

export const discordService = new DiscordService(discordConfig);
export const discordFormatter = new DiscordByCryptoFormatter();
export const discordNotifier: INotifier = new DiscordNotifier(
  discordFormatter,
  discordService,
);
