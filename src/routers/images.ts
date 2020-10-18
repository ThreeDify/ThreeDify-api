import { Router } from 'express';

import ImageController from '../controllers/images';

const router: Router = Router();

/**
 * @swagger
 *
 * /images/{file_name}:
 *  get:
 *    description: End point to serve uploaded image.
 *    parameters:
 *      - name: file_name
 *        in: path
 *        description: File name to serve
 *        required: true
 *    responses:
 *      200:
 *        description: Image
 *        content:
 *          image/*:
 *            schema:
 *               type: string
 *               format: binary
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/:file_name', ImageController.image);

export default router;
