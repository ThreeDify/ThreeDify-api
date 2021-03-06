import { QueryBuilder } from 'objection';

import BaseModel from './BaseModel';

const TABLE_NAME: string = 'users';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - id
 *        - username
 *        - last_name
 *        - first_name
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        lastName:
 *          type: string
 *        firstName:
 *          type: string
 *        password:
 *          type: string
 *        rawPassword:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *  responses:
 *    User:
 *      description: User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    UserArray:
 *      description: Array of User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 */
export class User extends BaseModel {
  id!: number;
  email!: string;
  username!: string;
  password?: string;
  lastName!: string;
  firstName!: string;

  createdAt?: Date;
  updatedAt?: Date;

  rawPassword?: string;

  static get tableName() {
    return TABLE_NAME;
  }

  static get modifiers() {
    return {
      defaultSelect(builder: QueryBuilder<User>) {
        const { ref } = User;
        builder.select(
          ref('id'),
          ref('username'),
          ref('lastName'),
          ref('firstName')
        );
      },
    };
  }
}

export default User;
