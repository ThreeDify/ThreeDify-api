import { Router } from 'express';

import HomeController from '../controllers/home';

const router: Router = Router();

router.get('/', HomeController.index);

export default router;
