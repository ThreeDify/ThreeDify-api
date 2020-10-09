import crypto from 'crypto';
import Debug, { Debugger } from 'debug';

import jwt from './jwt';
import config from '../config';
import User from '../domain/users';
import { TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:utils:tokens');

export function generateTokens(user: User): TokenCredential {
  debug('Generating access token.');
  const accessToken: string = jwt.sign(
    { userId: user.id },
    config.accessTokenSecret,
    config.accessTokenConfig
  );

  debug('Generating refresh token.');
  const refreshToken: string = jwt.sign(
    { data: crypto.randomBytes(256) },
    config.refreshTokenSecret + user.password,
    config.refreshTokenConfig
  );

  return {
    accessToken,
    refreshToken,
  };
}
