import { Model } from 'objection';

import User from './User';

const TABLE_NAME: string = 'tokens';

export class Token extends Model {
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
        relation: Model.BelongsToOneRelation,
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
