import { Model } from 'objection';
import User from './User';

const TABLE_NAME: string = 'images';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    Image:
 *      type: object
 *      required:
 *        - id
 *        - fileName
 *        - mimetype
 *        - uploadedBy
 *      properties:
 *        id:
 *          type: number
 *        fileName:
 *          type: string
 *        mimetype:
 *          type: string
 *        uploadedBy:
 *          type: number
 *        uploadedByUser:
 *          $ref: '#/components/schemas/User'
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *  responses:
 *    Image:
 *      description: Image data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Image'
 *    ImageArray:
 *      description: Array of Image data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Image'
 */
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
