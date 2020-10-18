import { Router } from 'express';

import authenticate from '../middlewares/authenticate';
import { uploadImages } from '../middlewares/uploadImage';
import ReconstructionController from '../controllers/reconstructions';
import validateNewReconstruction from '../middlewares/validateNewReconstruction';

const router: Router = Router();

const imageUploadMiddlewares = uploadImages('images');

/**
 * @swagger
 *
 * /reconstructions:
 *  get:
 *    description: End point to fetch all reconstructions.
 *    responses:
 *      200:
 *        $ref: '#/components/responses/ReconstructionArray'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/', ReconstructionController.index);

/**
 * @swagger
 *
 * /reconstructions/{id}:
 *  get:
 *    description: End point to fetch details of a reconstruction.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of reconstruction to fetch.
 *    responses:
 *      200:
 *        $ref: '#/components/responses/Reconstruction'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/:id', ReconstructionController.reconstruction);

/**
 * @swagger
 *
 * /reconstructions/create:
 *  post:
 *    description: End point to create new reconstruction.
 *    security:
 *      - Authentication: []
 *    requestBody:
 *      $ref: '#/components/requestBodies/NewReconstruction'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/ReconstructionCreationResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.post(
  '/create',
  authenticate,
  imageUploadMiddlewares[0],
  validateNewReconstruction,
  imageUploadMiddlewares[1],
  ReconstructionController.create
);

export default router;
