export const discordConfig = {
  token: process.env.DISCORD_BOT_TOKEN,
  applicationId: process.env.DISCORD_APPLICATION_ID,
  developmentGuildId: process.env.DISCORD_DEVELOPMENT_GUILD_ID,
  channelId: process.env.DISCORD_CHANNEL_ID,
};

export type DiscordConfig = typeof discordConfig;
