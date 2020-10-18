/**
 * @swagger
 *
 * components:
 *  schemas:
 *    APIDescription:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *        version:
 *          type: string
 *        description:
 *          type: string
 *  responses:
 *    APIDescription:
 *      description: API description response
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/APIDescription'
 */

export interface APIDescription {
  name: string;
  version: string;
  description: string;
}

export default APIDescription;
