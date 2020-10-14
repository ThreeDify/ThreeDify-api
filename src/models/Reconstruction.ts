import { Model } from 'objection';

import User from './User';
import Image from './Image';

const TABLE_NAME: string = 'reconstructions';

export class Reconstruction extends Model {
  id!: number;
  name!: string;
  createdBy!: number;

  createdAt?: Date;
  updatedAt?: Date;

  createdByUser?: User;
  images?: Image[];

  static get tableName() {
    return TABLE_NAME;
  }

  static get relationMappings() {
    return {
      createdByUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reconstructions.createdBy',
          to: 'users.id',
        },
      },
      images: {
        relation: Model.ManyToManyRelation,
        modelClass: Image,
        join: {
          from: 'reconstructions.id',
          through: {
            from: 'reconstructionImages.reconstructionId',
            to: 'reconstructionImages.imageId',
          },
          to: 'images.id',
        },
      },
    };
  }
}

export default Reconstruction;
