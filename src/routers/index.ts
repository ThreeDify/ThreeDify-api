import { Router } from 'express';

import homeRouter from './home';
import docsRouter from './docs';
import authRouter from './auth';
import userRouter from './users';
import imageRouter from './images';
import reconstructionRouter from './reconstructions';

import authenticateApp from '../middlewares/authenticateApp';

const router: Router = Router();

router.use('/', homeRouter);
router.use('/docs', docsRouter);
router.use('/auth', authenticateApp, authRouter);
router.use('/users', authenticateApp, userRouter);
router.use('/images', authenticateApp, imageRouter);
router.use('/reconstructions', authenticateApp, reconstructionRouter);

export default router;
