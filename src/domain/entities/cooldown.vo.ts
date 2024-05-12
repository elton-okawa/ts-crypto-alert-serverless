import { ValueObject } from '@src/domain/core';
import timestring from 'timestring';

export class Cooldown extends ValueObject {
  readonly value: string;
  private _milliseconds: number;

  get milliseconds() {
    return this._milliseconds;
  }

  constructor(value: string) {
    super();

    this.value = value;
    this._milliseconds = timestring(value, 'ms');
  }
}
