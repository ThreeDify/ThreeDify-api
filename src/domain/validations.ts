/**
 * @swagger
 *
 * components:
 *  schemas:
 *    ValidationError:
 *      type: object
 *      properties:
 *        value:
 *          type: object
 *        message:
 *          type: string
 *    ValidationErrorItem:
 *      type: object
 *      properties:
 *        key:
 *          $ref: '#/components/schemas/ValidationError'
 *    ValidationErrorResponse:
 *      type: object
 *      properties:
 *        errors:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ValidationErrorItem'
 *  responses:
 *    ValidationErrorResponse:
 *      description: Validation error response
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationErrorResponse'
 *    DuplicateDataErrorResponse:
 *      description: Duplicate data error.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationErrorResponse'
 *
 */

export interface ValidationError {
  value?: any;
  message: string;
}

export interface ValidationErrorItem {
  [key: string]: ValidationError;
}

export interface ValidationErrorResponse {
  errors: ValidationErrorItem[];
}
