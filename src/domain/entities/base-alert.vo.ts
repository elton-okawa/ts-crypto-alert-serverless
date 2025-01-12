import { ValueObject } from '@src/domain/core';
import { Cooldown } from './cooldown.vo';

export type BaseAlertParams = {
  cooldown: string | Cooldown;
};

export abstract class BaseAlert<T> extends ValueObject {
  readonly cooldown: Cooldown;

  constructor(params: Partial<BaseAlertParams>) {
    super();

    this.cooldown =
      params.cooldown instanceof Cooldown
        ? params.cooldown
        : Cooldown.create(params.cooldown);
  }

  abstract triggered(value: T): boolean;
}
