import { Router } from 'express';

import AuthController from '../controllers/auth';
import validateNewUser from '../middlewares/validateNewUser';
import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';
import validateLoginCredential from '../middlewares/validateLoginCredential';

const router: Router = Router();

router.post(
  '/register',
  validateNewUser,
  checkUniqueUsername,
  checkUniqueEmail,
  AuthController.register
);

router.post('/login', validateLoginCredential, AuthController.login);

export default router;
