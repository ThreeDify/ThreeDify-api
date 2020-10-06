import { Router } from 'express';

import AuthController from '../controllers/auth';
import validateNewUser from '../middlewares/validateNewUser';
import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';

const router: Router = Router();

router.post(
  '/register',
  validateNewUser,
  checkUniqueUsername,
  checkUniqueEmail,
  AuthController.register
);

export default router;
