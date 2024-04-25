export interface IConnectable {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
