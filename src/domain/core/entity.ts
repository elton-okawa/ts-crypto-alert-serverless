import { ObjectId } from 'mongodb';
import { ValueObject } from './value-object';

export abstract class Entity extends ValueObject {
  _id: ObjectId;

  createdAt: Date;

  get id() {
    return this._id;
  }

  constructor(params: Partial<Entity>) {
    super();

    this._id = params._id ?? new ObjectId();
    this.createdAt = params.createdAt ?? new Date();
  }
}
