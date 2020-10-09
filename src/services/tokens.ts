import Debug, { Debugger } from 'debug';

import knex from '../utils/knex';
import User from '../domain/users';
import Tokens from '../domain/tokens';
import { generateTokens } from '../utils/tokens';
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

export default {
  createTokens,
};
