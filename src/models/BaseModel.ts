import { Model } from 'objection';

export class BaseModel extends Model {
  static get filters(): string[] {
    return [];
  }
}

export default BaseModel;
