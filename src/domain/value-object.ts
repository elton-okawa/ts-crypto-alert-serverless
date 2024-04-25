export abstract class ValueObject {
  static create<TValueObject extends ValueObject>(
    this: new (params: Partial<TValueObject>) => TValueObject,
    params: Partial<TValueObject>,
  ): TValueObject {
    return new this(params);
  }

  static createMany<TValueObject extends ValueObject>(
    this: new (params: Partial<TValueObject>) => TValueObject,
    params: Partial<TValueObject>[],
  ): TValueObject[] {
    return params.map((p) => new this(p));
  }
}
