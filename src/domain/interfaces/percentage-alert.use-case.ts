import {
  Cryptocurrency,
  PercentageAlert,
  PercentageNotification,
} from '@src/domain/entities';
import { IUseCase } from './use-case';

export type PercentageAlertUseCaseParams = {
  cryptocurrency: Cryptocurrency;
  configs: PercentageAlert[];
};

export interface IPercentageAlertUseCase
  extends IUseCase<PercentageAlertUseCaseParams, PercentageNotification[]> {}
