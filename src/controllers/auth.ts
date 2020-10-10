import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import authService from '../services/auth';
import tokenService from '../services/tokens';
import { User, NewUser } from '../domain/users';
import { LoginCredential, TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:controller:auth');

export async function register(
  req: Request<{}, any, NewUser>,
  res: Response<User>,
  next: NextFunction
) {
  try {
    let user: User | undefined = await authService.createNewUser(req.body);

    if (user) {
      res.json(user);
      return;
    }

    throw new Error('Error while creating user.');
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while creating user.',
      ...err,
    });
  }
}

export async function login(
  req: Request<{}, any, LoginCredential>,
  res: Response<TokenCredential>,
  next: NextFunction
) {
  try {
    debug('Authenticating user.');
    let user: User | undefined = await authService.login(req.body);

    if (user) {
      debug('Generating tokens for user.');
      const tokens: TokenCredential = await tokenService.createTokens(user);

      res.json(tokens);
      return;
    }

    next({
      status: 401,
      message: 'Username or Password is incorrect.',
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

export async function refresh(
  req: Request<{}, any, LoginCredential>,
  res: Response<TokenCredential>,
  next: NextFunction
) {
  try {
    debug('Check if refresh token header exists.');
    const refreshToken: string | undefined = req
      .header('x-refresh-token')
      ?.trim();

    if (refreshToken) {
      debug('Refresh tokens.');
      const refreshedToken:
        | TokenCredential
        | undefined = await tokenService.refreshTokens({
        refreshToken,
      });

      if (refreshedToken) {
        res.json(refreshedToken);
        return;
      }
    }

    next({
      status: 401,
      message: 'Invalid refresh token',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while refreshing token.',
      ...err,
    });
  }
}

export default {
  login,
  register,
  refresh,
};
