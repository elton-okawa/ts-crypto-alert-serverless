import { PercentageAlert, PercentageNotification } from '@src/domain/entities';
import { IUseCase } from './use-case';

export type Params = {
  symbol: string;
  configs: PercentageAlert[];
};

export interface IPercentageAlertUseCase
  extends IUseCase<Params, PercentageNotification[]> {}
