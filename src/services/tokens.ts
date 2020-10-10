import Debug, { Debugger } from 'debug';

import knex from '../utils/knex';
import userService from './users';
import User from '../domain/users';
import Tokens from '../domain/tokens';
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
  await knex()('tokens').insert<Tokens>({
    user_id: user.id,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });

  return tokens;
}

export async function fetchTokenByUserId(
  userId: number
): Promise<Tokens[] | undefined> {
  return await knex()
    .select('*')
    .from<Tokens>('tokens')
    .where('user_id', '=', userId);
}

export async function fetchTokenByAccessToken(
  accessToken: string
): Promise<Tokens | undefined> {
  return await knex()
    .select('*')
    .from<Tokens>('tokens')
    .where('access_token', '=', accessToken)
    .first();
}

export async function fetchTokenByRefreshToken(
  refreshToken: string
): Promise<Tokens | undefined> {
  return await knex()
    .select('*')
    .from<Tokens>('tokens')
    .where('refresh_token', '=', refreshToken)
    .first();
}

export async function refreshTokens(
  tokenCred: TokenCredential
): Promise<TokenCredential | undefined> {
  debug('Check if refresh token exists.');
  if (!tokenCred.refreshToken) {
    return;
  }

  debug('Check if token is not revoked.');
  const token: Tokens | undefined = await fetchTokenByRefreshToken(
    tokenCred.refreshToken
  );

  if (token?.id) {
    debug('Check if user exists.');
    const user: User | undefined = await userService.fetchUserById(
      token.user_id
    );

    if (user) {
      debug('Check if the tokens are valid.');
      const [_, isRefreshTokenValid] = verifyTokenSign(tokenCred, user);

      if (isRefreshTokenValid) {
        const refreshedAccessToken = generateAccessToken();

        await knex()('tokens').where('id', '=', token.id).update({
          access_token: refreshedAccessToken,
        });

        return {
          accessToken: refreshedAccessToken,
          refreshToken: tokenCred.refreshToken,
        };
      }
    }

    debug('Delete invalid token.');
    await knex()('tokens').where('id', '=', token.id).delete();
  }

  return;
}

export default {
  createTokens,
  fetchTokenByUserId,
  fetchTokenByAccessToken,
  fetchTokenByRefreshToken,
};
