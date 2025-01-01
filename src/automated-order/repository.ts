import { DatabaseService } from '@src/infra/database';
import { Logger } from '@src/logger';
import { AutomatedOrderConfig } from './automated-order-config.entity';
import { AutomatedDecision } from './automated-decision.entity';

export class AutomatedOrderRepository {
  private readonly logger = new Logger(AutomatedOrderRepository.name);

  constructor(private database: DatabaseService) {}

  async getConfig(code: string): Promise<AutomatedOrderConfig> {
    this.logger.log(`Getting config for "${code}"...`);

    let config = await this.internalGetConfig(code);
    if (!config) {
      config = await this.internalGetConfig('default');
    }

    this.logger.log(`Config for "${code}" found successfully!`);
    return AutomatedOrderConfig.create(config);
  }

  private internalGetConfig(code: string): Promise<AutomatedOrderConfig> {
    return this.database.db
      .collection<AutomatedOrderConfig>(AutomatedOrderConfig.TABLE)
      .findOne({ code });
  }

  async saveDecision(decision: AutomatedDecision): Promise<void> {
    await this.database.db
      .collection(AutomatedDecision.TABLE)
      .insertOne(JSON.parse(JSON.stringify(decision)));
  }
}
