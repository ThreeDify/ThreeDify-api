import { Router } from 'express';

import authenticate from '../middlewares/authenticate';
import { uploadImages } from '../middlewares/uploadImage';
import ReconstructionController from '../controllers/reconstructions';
import validateNewReconstruction from '../middlewares/validateNewReconstruction';

const router: Router = Router();

const imageUploadMiddlewares = uploadImages('images');

router.get('/', ReconstructionController.index);

router.get('/:id', ReconstructionController.reconstruction);

router.post(
  '/create',
  authenticate,
  imageUploadMiddlewares[0],
  validateNewReconstruction,
  imageUploadMiddlewares[1],
  ReconstructionController.create
);

export default router;
