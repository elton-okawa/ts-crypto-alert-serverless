import { databaseConfig } from './database.config';
import { DatabaseService } from './database.service';

export type { DatabaseService } from './database.service';

export const databaseService = new DatabaseService(databaseConfig);
