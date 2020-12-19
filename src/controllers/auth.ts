import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import User from '../models/User';
import Token from '../models/Token';
import { NewUser } from '../domain/NewUser';
import tokenService from '../services/tokens';
import UserResponse from '../domain/UserResponse';
import userAuthService from '../services/userAuth';
import { LoginCredential, TokenCredential } from '../domain/login';
import { AuthenticatedRequest } from '../middlewares/authenticateUser';

const debug: Debugger = Debug('threedify:controller:auth');

export async function register(
  req: Request<{}, any, NewUser>,
  res: Response<UserResponse>,
  next: NextFunction
) {
  try {
    let user: User | undefined = await userAuthService.createNewUser(req.body);

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
      });

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
    let user: User | undefined = await userAuthService.login(req.body);

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

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    debug('Fetching active token.');
    const token: Token | undefined = await tokenService.fetchTokenByAccessToken(
      authReq.tokenCred.accessToken || ''
    );

    if (token) {
      debug('Deleting active token.');
      await tokenService.deleteTokens(token);
    }

    res.sendStatus(404);
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while logging out.',
      ...err,
    });
    return;
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
  logout,
  register,
  refresh,
};
