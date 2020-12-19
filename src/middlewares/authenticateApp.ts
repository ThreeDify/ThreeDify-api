import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import App from '../models/App';
import appAuth from '../services/appAuth';

const debug: Debugger = Debug('threedify:middleware:authenticateApp');

export async function authenticateApp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    debug('Authenticating App...');
    const appId: string | undefined = req.header('x-threedify-app-id')?.trim();
    const appSecret: string | undefined = req
      .header('x-threedify-app-secret')
      ?.trim();

    debug('Check if app id and secret exists.');
    if (appId && appSecret) {
      const authenticatedApp: App | undefined = await appAuth.authenticate({
        key: appId,
        secret: appSecret,
      });

      if (authenticatedApp) {
        debug('App %s authenticated successfully.', authenticatedApp.name);
        next();
        return;
      }
    }

    next({
      status: 401,
      message: 'Invalid app id or secret.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while authenticating app.',
      ...err,
    });
  }
}

export default authenticateApp;
