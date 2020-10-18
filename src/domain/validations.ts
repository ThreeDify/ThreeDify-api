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
 */
export interface ValidationError {
  value?: any;
  message: string;
}

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    ValidationErrorItem:
 *      type: object
 *      properties:
 *        key:
 *          $ref: '#/components/schemas/ValidationError'
 */
export interface ValidationErrorItem {
  [key: string]: ValidationError;
}

/**
 * @swagger
 *
 * components:
 *  schemas:
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
export interface ValidationErrorResponse {
  errors: ValidationErrorItem[];
}
