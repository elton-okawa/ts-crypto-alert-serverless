export const discordConfig = {
  token: process.env.DISCORD_BOT_TOKEN,
  channelId: process.env.DISCORD_CHANNEL_ID,
};

export type DiscordConfig = typeof discordConfig;
