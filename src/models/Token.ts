import User from './User';
import BaseModel from './BaseModel';

const TABLE_NAME: string = 'tokens';

export class Token extends BaseModel {
  id!: number;
  userId!: number;
  accessToken!: string;
  refreshToken!: string;

  createdAt?: Date;
  updatedAt?: Date;

  user?: User;

  static get tableName() {
    return TABLE_NAME;
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tokens.userId',
          to: 'users.id',
        },
      },
    };
  }
}

export default Token;
