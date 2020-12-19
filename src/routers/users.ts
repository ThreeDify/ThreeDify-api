import { Router } from 'express';

import { sendStatus } from '../utils/response';

import UserController from '../controllers/users';

import authenticateUser from '../middlewares/authenticateUser';
import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';
import ReconstructionController from '../controllers/reconstructions';

const router: Router = Router();

/**
 * @swagger
 *
 * /users/me:
 *  get:
 *    description: End point to fetch current logged in user info.
 *    security:
 *      - Authentication: []
 *    responses:
 *      200:
 *        $ref: '#/components/responses/UserResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/me', authenticateUser, UserController.me);

/**
 * @swagger
 *
 * /users:
 *  get:
 *    description: End point to fetch all users.
 *    security:
 *      - Authentication: []
 *    responses:
 *      200:
 *        $ref: '#/components/responses/UserArrayResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/', authenticateUser, UserController.index);

/**
 * @swagger
 *
 * /users/{user_id}:
 *  get:
 *    description: End point to fetch specific user info.
 *    security:
 *      - Authentication: []
 *    parameters:
 *      - name: user_id
 *        in: path
 *        description: Id of user to fetch information.
 *    responses:
 *      200:
 *        $ref: '#/components/responses/UserResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/:userId(\\d+)', authenticateUser, UserController.user);

/**
 * @swagger
 *
 * /users/{user_id}/reconstructions:
 *  get:
 *    description: End point to fetch reconstructions of a user.
 *    security:
 *      - Authentication: []
 *    parameters:
 *      - name: user_id
 *        in: path
 *        description: Id of user to fetch reconstructions.
 *      - $ref: '#/components/parameters/q'
 *      - $ref: '#/components/parameters/page'
 *      - $ref: '#/components/parameters/size'
 *      - $ref: '#/components/parameters/reconstruction_filters'
 *      - $ref: '#/components/parameters/order'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/PaginatedReconstructionResult'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get(
  '/:userId(\\d+)/reconstructions',
  authenticateUser,
  ReconstructionController.userReconstruction
);

/**
 * @swagger
 *
 * /users/uniqueEmail:
 *  get:
 *    description: End point to check uniqueness of email.
 *    parameters:
 *      - name: email
 *        in: query
 *        description: Email to check uniqueness.
 *    responses:
 *      200:
 *        description: Email is unique
 *      409:
 *        $ref: '#/components/responses/DuplicateDataErrorResponse'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/uniqueEmail', checkUniqueEmail, sendStatus(200));

/**
 * @swagger
 *
 * /users/uniqueUsername:
 *  get:
 *    description: End point to check uniqueness of username.
 *    parameters:
 *      - name: username
 *        in: query
 *        description: Username to check uniqueness.
 *    responses:
 *      200:
 *        description: Username is unique
 *      409:
 *        $ref: '#/components/responses/DuplicateDataErrorResponse'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/uniqueUsername', checkUniqueUsername, sendStatus(200));

export default router;
