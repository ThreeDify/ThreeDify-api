import { Router } from 'express';

import homeRouter from './home';
import authRouter from './auth';
import userRouter from './users';
import imageRouter from './images';
import reconstructionRouter from './reconstructions';

const router: Router = Router();

router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/images', imageRouter);
router.use('/reconstructions', reconstructionRouter);

export default router;
