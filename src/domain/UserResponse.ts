/**
 * @swagger
 *
 * components:
 *  schemas:
 *    UserResponse:
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
 *          format: email
 *        username:
 *          type: string
 *          minLength: 5
 *          maxLength: 15
 *          pattern: ^[a-zA-Z0-9_]*$
 *        last_name:
 *          type: string
 *        first_name:
 *          type: string
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *  responses:
 *    UserResponse:
 *      description: User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserResponse'
 *    UserArrayResponse:
 *      description: Array of User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/UserResponse'
 *
 */
export interface UserResponse {
  id: number;
  email?: string;
  username: string;
  last_name: string;
  first_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export default UserResponse;
