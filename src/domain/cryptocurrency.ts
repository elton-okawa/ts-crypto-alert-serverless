import { Entity } from '@src/domain/entity';

export class Cryptocurrency extends Entity {
  static readonly TABLE = 'cryptocurrency';

  name: string;
  symbol: string;

  private constructor(params: Partial<Cryptocurrency>) {
    super(params);

    this.name = params.name;
    this.symbol = params.symbol;
  }
}
