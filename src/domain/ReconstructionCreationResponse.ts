import Reconstruction from '../models/Reconstruction';
import { ValidationErrorItem } from '../domain/validations';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    ReconstructionCreationResponse:
 *      type: object
 *      properties:
 *        reconstruction:
 *          $ref: '#/components/schemas/Reconstruction'
 *        errors:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ValidationErrorItem'
 *  responses:
 *    ReconstructionCreationResponse:
 *      description: User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ReconstructionCreationResponse'
 *
 */
export interface ReconstructionCreationResponse {
  reconstruction?: Reconstruction;
  errors?: ValidationErrorItem[];
}

export default ReconstructionCreationResponse;
