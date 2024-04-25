export interface IUseCase<TParams, TReturn> {
  execute(params: TParams): Promise<TReturn> | TReturn;
}
