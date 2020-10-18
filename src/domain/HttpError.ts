/**
 * @swagger
 *
 * components:
 *  schemas:
 *    HTTPError:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *        message:
 *          type: string
 *        error:
 *          type: object
 *  responses:
 *    HTTPError:
 *      description: HTTP Error response
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/HTTPError'
 */

import { HttpError as Error } from 'http-errors';

export interface HTTPError {
  code: number;
  message: string;
  error?: Error;
}

export default HTTPError;
