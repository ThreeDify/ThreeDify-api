import Debug, { Debugger } from 'debug';

import userService from './users';
import User from '../models/User';
import Token from '../models/Token';
import {
  generateAccessToken,
  generateTokens,
  verifyTokenSign,
} from '../utils/tokens';
import { TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:services:tokens');

export async function createTokens(user: User): Promise<TokenCredential> {
  debug('Creating tokens.');
  const tokens: TokenCredential = generateTokens(user);

  debug('Saving tokens.');
  await Token.query().insert({
    ...tokens,
    userId: user.id,
  });

  return tokens;
}

export async function fetchTokenByUserId(
  userId: number
): Promise<Token[] | undefined> {
  return await Token.query().where('userId', '=', userId);
}

export async function fetchTokenByAccessToken(
  accessToken: string
): Promise<Token | undefined> {
  return await Token.query().where('accessToken', '=', accessToken).first();
}

export async function fetchTokenByRefreshToken(
  refreshToken: string
): Promise<Token | undefined> {
  return await Token.query().where('refreshToken', '=', refreshToken).first();
}

export async function refreshTokens(
  tokenCred: TokenCredential
): Promise<TokenCredential | undefined> {
  debug('Check if refresh token exists.');
  if (!tokenCred.refreshToken) {
    return;
  }

  debug('Check if token is not revoked.');
  const token: Token | undefined = await fetchTokenByRefreshToken(
    tokenCred.refreshToken
  );

  if (token?.id) {
    debug('Check if user exists.');
    const user: User | undefined = await userService.fetchUserById(
      token.userId,
      {
        withPassword: true,
      }
    );

    if (user) {
      debug('Check if the tokens are valid.');
      const [_, isRefreshTokenValid] = verifyTokenSign(tokenCred, user);

      if (isRefreshTokenValid) {
        debug('Generate new access token.');
        const refreshedAccessToken = generateAccessToken();

        debug('Update access token in database.');
        await Token.query()
          .patch({ accessToken: refreshedAccessToken })
          .where('id', '=', token.id);

        return {
          accessToken: refreshedAccessToken,
          refreshToken: tokenCred.refreshToken,
        };
      }
    }

    debug('Delete invalid token.');
    deleteTokens(token);
  }

  return;
}

export async function deleteTokens(token: Token) {
  if (token.id) {
    debug('Deleting token with id: %d', token.id);
    await Token.query().deleteById(token.id);
  }
}

export default {
  createTokens,
  deleteTokens,
  refreshTokens,
  fetchTokenByUserId,
  fetchTokenByAccessToken,
  fetchTokenByRefreshToken,
};
