import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

import User from '../models/User';
import { TokenCredential } from '../domain/login';
import userAuthService from '../services/userAuth';

const debug: Debugger = Debug('threedify:middleware:authenticateUser');

export interface AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: User;
  tokenCred: TokenCredential;
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    debug('Authenticating User...');
    const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
    const authCode: string | undefined = authReq.header('authorization');

    debug('Check if authentication code exists.');
    if (authCode) {
      const [authType, accessToken] = authCode.trim().split(' ');

      debug('Check if access token exists.');
      if (authType.toLowerCase() === 'bearer' && accessToken) {
        debug('Authenticate with access token.');
        const user: User | undefined = await userAuthService.authenticate({
          accessToken,
        });

        if (user) {
          authReq.user = user;
          authReq.tokenCred = {
            accessToken,
          };

          next();
          return;
        }
      }
    }

    next({
      status: 401,
      message: 'Invalid access token.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while authenticating.',
      ...err,
    });
  }
}

export default authenticateUser;
