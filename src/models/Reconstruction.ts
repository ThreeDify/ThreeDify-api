import { QueryBuilder } from 'objection';

import User from './User';
import Image from './Image';
import BaseModel from './BaseModel';
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
 *        - state
 *        - createdBy
 *        - createdByUser
 *        - createdAt
 *        - updatedAt
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
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *  parameters:
 *    reconstruction_filters:
 *      in: query
 *      name: filters
 *      description: Filters to apply to generate pages. For multiple filters, use comma(,) separated value.<br>
 *                   Use filters to select only some data. For example, `inQueue` filters reconstruction that are in queue.<br>
 *                   This can also be used to order data. For example, `orderByCreatedAt` sorts data by createdAt field.
 *      required: false
 *      schema:
 *        type: string
 *        enum:
 *          - orderByCreatedAt
 *          - inQueue
 *          - inProgress
 *          - failed
 *          - completed
 *  responses:
 *    Reconstruction:
 *      description: Reconstruction data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Reconstruction'
 *    PaginatedReconstructionResult:
 *      description: Paginated array of Reconstruction data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/PaginatedResult'
 *              - type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Reconstruction'
 */
export class Reconstruction extends BaseModel {
  id!: number;
  name!: string;
  createdBy!: number;
  state!: ReconstructionState;
  reconstructionFile?: string;

  createdAt?: Date;
  updatedAt?: Date;

  createdByUser?: User;
  images?: Image[];

  static get tableName() {
    return TABLE_NAME;
  }

  static get modifiers() {
    return {
      search(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;
        const q = builder.context().queryString;

        builder.where(ref('name'), 'like', `%${q}%`);
      },
      defaultSelect(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;
        builder.select(
          ref('id'),
          ref('name'),
          ref('state'),
          ref('createdBy'),
          ref('createdAt'),
          ref('updatedAt')
        );
      },
      withReconstructionFile(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;
        builder.select(ref('reconstructionFile'));
      },
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
      failed(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.where(ref('state'), '=', ReconstructionState.FAILED);
      },
      orderByCreatedAt(builder: QueryBuilder<Reconstruction>) {
        const { ref } = Reconstruction;

        builder.orderBy(ref('createdAt'), builder.context().sortOrder || 'ASC');
      },
    };
  }

  static get filters(): string[] {
    return [
      'search',
      'inQueue',
      'inProgress',
      'completed',
      'failed',
      'orderByCreatedAt',
    ];
  }

  static get relationMappings() {
    return {
      createdByUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reconstructions.createdBy',
          to: 'users.id',
        },
      },
      images: {
        relation: BaseModel.ManyToManyRelation,
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
