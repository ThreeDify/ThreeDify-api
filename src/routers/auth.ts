import { Router } from 'express';

import AuthController from '../controllers/auth';
import authenticate from '../middlewares/authenticate';
import validateNewUser from '../middlewares/validateNewUser';
import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';
import validateLoginCredential from '../middlewares/validateLoginCredential';

const router: Router = Router();

/**
 * @swagger
 *
 * /auth/register:
 *  post:
 *    description: End point to register new users.
 *    requestBody:
 *      $ref: '#/components/requestBodies/NewUser'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/UserResponse'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      409:
 *        $ref: '#/components/responses/DuplicateDataErrorResponse'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.post(
  '/register',
  validateNewUser,
  checkUniqueUsername,
  checkUniqueEmail,
  AuthController.register
);

/**
 * @swagger
 *
 * /auth/login:
 *  post:
 *    description: End point for user login.
 *    requestBody:
 *      $ref: '#/components/requestBodies/LoginCredential'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/TokenCredential'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.post('/login', validateLoginCredential, AuthController.login);

/**
 * @swagger
 *
 * /auth/logout:
 *  delete:
 *    description: End point for user logout. Deletes the token used for authentication.
 *    security:
 *      - Authentication: []
 *    responses:
 *      404:
 *        description: Logged out successfully.
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.delete('/logout', authenticate, AuthController.logout);

/**
 * @swagger
 *
 * /auth/refresh:
 *  post:
 *    description: End point to refresh token.
 *    parameters:
 *      - $ref: '#/components/parameters/RefreshTokenParam'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/TokenCredential'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.post('/refresh', AuthController.refresh);

export default router;
