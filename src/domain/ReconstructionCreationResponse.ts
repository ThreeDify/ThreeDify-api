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
 *  responses:
 *    ReconstructionCreationResponse:
 *      description: User data in JSON response.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ReconstructionCreationResponse'
 *
 */

import Reconstruction from '../models/Reconstruction';

export interface ReconstructionCreationResponse {
  reconstruction?: Reconstruction;
}

export default ReconstructionCreationResponse;
