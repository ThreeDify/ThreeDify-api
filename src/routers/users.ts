import { Router } from 'express';

import { sendStatus } from '../utils/response';

import UserController from '../controllers/users';

import authenticate from '../middlewares/authenticate';
import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';
import ReconstructionController from '../controllers/reconstructions';

const router: Router = Router();

router.get('/me', authenticate, UserController.me);
router.get('/', authenticate, UserController.index);
router.get('/:userId(\\d+)', authenticate, UserController.user);

router.get(
  '/:userId(\\d+)/reconstructions',
  authenticate,
  ReconstructionController.userReconstruction
);

router.get('/uniqueEmail', checkUniqueEmail, sendStatus(200));
router.get('/uniqueUsername', checkUniqueUsername, sendStatus(200));

export default router;
