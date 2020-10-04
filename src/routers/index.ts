import { Router } from 'express';

import homeRouter from './home';
import authRouter from './auth';
import userRouter from './users';

const router: Router = Router();

router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
