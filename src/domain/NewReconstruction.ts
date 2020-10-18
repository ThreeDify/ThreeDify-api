/**
 * @swagger
 *
 * components:
 *  schemas:
 *    NewReconstruction:
 *      type: object
 *      required:
 *        - reconstruction_name
 *        - images
 *      properties:
 *        reconstruction_name:
 *          type: string
 *          maxLength: 20
 *        images:
 *          type: array
 *          items:
 *            type: string
 *            format: binary
 *
 *  requestBodies:
 *    NewReconstruction:
 *      description: Data for new user.
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/NewReconstruction'
 *
 */

export interface NewReconstruction {
  reconstruction_name: string;
}

export default NewReconstruction;
