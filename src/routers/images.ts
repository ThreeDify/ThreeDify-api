import { Router } from 'express';

import ImageController from '../controllers/images';

const router: Router = Router();

router.get('/:file_name', ImageController.image);

export default router;
