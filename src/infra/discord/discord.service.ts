import { Client, GatewayIntentBits } from 'discord.js';
import { DiscordConfig } from './discord.config';
import { Logger } from '@src/logger';
import { IConnectable } from '@src/domain';

export class DiscordService implements IConnectable {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  constructor(private config: DiscordConfig) {}

  async connect() {
    this.logger.log('Connecting Discord client...');

    this.client = new Client({ intents: [GatewayIntentBits.GuildMessages] });

    await this.client.login(this.config.token);

    this.logger.log('Discord client connected successfully!');
  }

  async disconnect() {
    this.logger.log('Disconnecting Discord client...');

    await this.client.destroy();

    this.logger.log('Discord client disconnected successfully!');
  }

  async send(message: string) {
    this.logger.log('Sending message...');

    const channel = await this.client.channels.fetch(this.config.channelId);
    if (!channel.isTextBased()) {
      this.logger.error(`Channel "${channel.name}" is not text based`);
      return;
    }

    await channel.send(message);

    this.logger.log('Message sent successfully!');
  }
}
