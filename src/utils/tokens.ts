import crypto from 'crypto';
import Debug, { Debugger } from 'debug';

import jwt from './jwt';
import config from '../config';
import User from '../models/User';
import { TokenCredential } from '../domain/login';
import AccessTokenPayload from '../domain/AccessTokenPayload';

const debug: Debugger = Debug('threedify:utils:tokens');

export function generateAccessToken(user: User): string {
  debug('Generating access token.');

  return jwt.sign(
    { data: { id: user.id, random: crypto.randomBytes(256) } },
    config.accessTokenSecret,
    config.accessTokenConfig
  );
}

export function generateTokens(user: User): TokenCredential {
  const accessToken: string = generateAccessToken(user);

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

export function verifyAndDecodeAccessToken(
  accessToken: string
): boolean | AccessTokenPayload {
  debug('Check if access token exists.');
  if (accessToken) {
    debug('Verifing and decoding access token.');
    let isAccessTokenValid: boolean | AccessTokenPayload = jwt.decode(
      accessToken,
      config.accessTokenSecret
    );

    return isAccessTokenValid;
  }

  return false;
}

export default {
  generateTokens,
  verifyTokenSign,
  generateAccessToken,
  verifyAndDecodeAccessToken,
};
