import { Router } from 'express';

import AuthController from '../controllers/auth';
import { validateNewUser } from '../middlewares/validateNewUser';

const router: Router = Router();

router.post('/register', validateNewUser, AuthController.register);

export default router;
