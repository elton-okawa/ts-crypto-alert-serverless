import { Db, MongoClient } from 'mongodb';
import { DatabaseConfig } from './database.config';
import { Logger } from '@src/logger';
import { IConnectable } from '@src/domain';

export class DatabaseService implements IConnectable {
  private readonly logger = new Logger(DatabaseService.name);
  private client: MongoClient;
  public db: Db;

  constructor(private config: DatabaseConfig) {}

  async connect() {
    this.logger.log(
      `Connecting to MongoDB: ${this.censorUrl(this.config.url)}`,
    );
    this.client = await MongoClient.connect(this.config.url);
    this.db = this.client.db(this.config.name);
    this.logger.log('Connected successfully');
  }

  async disconnect() {
    this.logger.log('Disconnecting MongoDB');
    await this.client.close();
    this.logger.log('Disconnected successfully');
  }

  censorUrl(url: string) {
    const beforePassword = url.substring(0, url.indexOf('//') + 2);
    const afterPassword = url.substring(url.indexOf('@'));

    return `${beforePassword}*****:*****${afterPassword}`;
  }
}
