import cors from 'cors';
import morgan from 'morgan';
import Debug, { Debugger } from 'debug';
import { json, urlencoded } from 'body-parser';
import express, { Application } from 'express';

import config from './config';
import appRouter from './routers';
import { handle404, handleError } from './errorHandler';

const debug: Debugger = Debug('threedify:app');

const app: Application = express();

app.use(morgan(config.requestLogFormat));

app.use(cors(config.corsConfig));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(appRouter);

app.use(handle404);
app.use(handleError);

export default app;
