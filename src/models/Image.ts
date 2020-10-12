import { Model } from 'objection';
import User from './User';

const TABLE_NAME: string = 'images';

export class Image extends Model {
  id!: number;
  fileName!: string;
  mimetype!: string;
  uploadedBy!: number;

  createdAt?: Date;
  updatedAt?: Date;

  uploadedByUser?: User;

  static get tableName() {
    return TABLE_NAME;
  }

  static get relationMappings() {
    return {
      uploadedByUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'images.uploadedBy',
          to: 'users.id',
        },
      },
    };
  }
}

export default Image;
