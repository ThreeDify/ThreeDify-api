import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from '../config';

const router: Router = Router();

router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(config.swaggerConfig))
);

export default router;
