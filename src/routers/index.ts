import { Router } from 'express';

import homeRouter from './home';

const router: Router = Router();

router.use('/', homeRouter);

export default router;
