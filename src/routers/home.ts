import { Router } from 'express';

import HomeController from '../controllers/home';

const router: Router = Router();

/**
 * @swagger
 *
 * /:
 *  get:
 *    description: Base API endpoint
 *    produces:
 *      application/json
 *    responses:
 *      200:
 *        $ref: '#/components/responses/APIDescription'
 */
router.get('/', HomeController.index);

export default router;
