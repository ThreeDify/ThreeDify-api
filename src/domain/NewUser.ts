/**
 * @swagger
 *
 * components:
 *  schemas:
 *    NewUser:
 *      type: object
 *      required:
 *        - email
 *        - username
 *        - first_name
 *        - last_name
 *        - rawPassword
 *      properties:
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
 *        rawPassword:
 *          type: string
 *          minLength: 8
 *          maxLength: 20
 *  requestBodies:
 *    NewUser:
 *      description: Data for new user.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewUser'
 *
 */
export interface NewUser {
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  rawPassword: string;
}

export default NewUser;
