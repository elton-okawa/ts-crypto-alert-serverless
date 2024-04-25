import { ObjectId } from 'mongodb';
import { ValueObject } from './value-object';

export abstract class Entity extends ValueObject {
  _id: ObjectId;

  get id() {
    return this._id;
  }

  constructor(params: Partial<Entity>) {
    super();

    this._id = params.id ?? new ObjectId();
  }
}
