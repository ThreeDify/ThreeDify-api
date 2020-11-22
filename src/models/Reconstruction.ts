import { Model, QueryBuilder } from 'objection';

import User from './User';
import Image from './Image';
import ReconstructionState from '../domain/ReconstructionState';

const TABLE_NAME: string = 'reconstructions';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    Reconstruction:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        state:
 *          $ref: '#/components/schemas/ReconstructionState'
 *        images:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Image'
 *        createdBy:
 *          type: number
 *        createdByUser:
 *          $ref: '#/components/schemas/User'
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *  responses:
 *    Reconstruction:
 *      description: Reconstruction data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Reconstruction'
 *    ReconstructionArray:
 *      description: Array of Reconstruction data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Reconstruction'
 */
export class Reconstruction extends Model {
  id!: number;
  name!: string;
  createdBy!: number;
  state!: ReconstructionState;

  createdAt?: Date;
  updatedAt?: Date;

  createdByUser?: User;
  images?: Image[];

  static get tableName() {
    return TABLE_NAME;
  }

  static get modifiers() {
    return {
      inQueue(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.where(ref('state'), '=', ReconstructionState.INQUEUE);
      },
      inProgress(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.where(ref('state'), '=', ReconstructionState.INPROGRESS);
      },
      completed(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.where(ref('state'), '=', ReconstructionState.COMPLETED);
      },
      orderByCreatedAt(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.orderBy(ref('createdAt'), builder.context().sortOrder || 'ASC');
      },
    };
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
