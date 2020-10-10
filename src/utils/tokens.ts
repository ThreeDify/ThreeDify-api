import crypto from 'crypto';
import Debug, { Debugger } from 'debug';

import jwt from './jwt';
import config from '../config';
import User from '../domain/users';
import { TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:utils:tokens');

export function generateAccessToken(): string {
  debug('Generating access token.');

  return jwt.sign(
    { data: crypto.randomBytes(256) },
    config.accessTokenSecret,
    config.accessTokenConfig
  );
}

export function generateTokens(user: User): TokenCredential {
  const accessToken: string = generateAccessToken();

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

export function verifyTokenSign(tokens: TokenCredential, user: User) {
  let isAccessTokenValid: boolean = false;
  let isRefreshTokenValid: boolean = false;

  debug('Check if access token exists.');
  if (tokens.accessToken) {
    debug('Verifing access token.');
    isAccessTokenValid = jwt.verify(
      tokens.accessToken,
      config.accessTokenSecret
    );
  }

  debug('Check if refresh token exists.');
  if (tokens.refreshToken) {
    debug('Verifing refresh token.');
    isRefreshTokenValid = jwt.verify(
      tokens.refreshToken,
      config.refreshTokenSecret + user.password
    );
  }

  return [isAccessTokenValid, isRefreshTokenValid];
}

export function refresh(refreshToken: string): TokenCredential | boolean {
  debug('Check if refresh token exists.');
  if (!refreshToken) {
    return false;
  }

  debug('Verifing refresh token.');
  const isRefreshTokenValid: boolean = jwt.verify(
    refreshToken,
    config.refreshTokenSecret
  );

  if (isRefreshTokenValid) {
    return {
      refreshToken,
      accessToken: generateAccessToken(),
    };
  }

  return false;
}

export default {
  generateAccessToken,
  generateTokens,
  verifyTokenSign,
  refresh,
};
