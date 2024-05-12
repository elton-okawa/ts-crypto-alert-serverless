export abstract class ValueObject {
  static create<TParams, TResult extends ValueObject>(
    this: new (params: TParams) => TResult,
    params: TParams,
  ): TResult {
    return new this(params);
  }

  static createMany<TParams, TResult extends ValueObject>(
    this: new (params: TParams) => TResult,
    params: TParams[],
  ): TResult[] {
    return params.map((p) => new this(p));
  }
}
