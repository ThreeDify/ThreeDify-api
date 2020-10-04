import { Router } from 'express';

import UserController from '../controllers/users';

const router: Router = Router();

router.get('/', UserController.index);
router.get('/:userId(\\d+)', UserController.user);

export default router;
