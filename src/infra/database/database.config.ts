export const databaseConfig = {
  url: process.env.DATABASE_URL,
  name: process.env.DATABASE_NAME,
};

export type DatabaseConfig = typeof databaseConfig;
