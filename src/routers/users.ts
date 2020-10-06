import { Router } from 'express';

import { sendStatus } from '../utils/response';

import UserController from '../controllers/users';

import checkUniqueEmail from '../middlewares/checkUniqueEmail';
import checkUniqueUsername from '../middlewares/checkUniqueUsername';

const router: Router = Router();

router.get('/', UserController.index);
router.get('/:userId(\\d+)', UserController.user);

router.get('/uniqueEmail', checkUniqueEmail, sendStatus(200));
router.get('/uniqueUsername', checkUniqueUsername, sendStatus(200));

export default router;
