import Debug, { Debugger } from 'debug';

import userService from './users';
import tokenService from './tokens';
import Tokens from '../domain/tokens';
import { hash, compare } from '../utils/hash';
import { User, NewUser } from '../domain/users';
import { verifyTokenSign } from '../utils/tokens';
import { LoginCredential, TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:services:auth');

export async function createNewUser(
  newUser: NewUser
): Promise<User | undefined> {
  debug('Creating new user.');

  debug('Hashing user password.');
  const hashedPassword: string = await hash(newUser.rawPassword);

  const user: User = {
    email: newUser.email,
    password: hashedPassword,
    username: newUser.username,
    last_name: newUser.last_name,
    first_name: newUser.first_name,
  };

  const userId: number = await userService.insertUser(user);
  debug('User inserted successful.');

  return await userService.fetchUserById(userId);
}

export async function login(
  credential: LoginCredential
): Promise<User | undefined> {
  debug('Authenticating user.');

  debug('Reteriving user.');
  const user: User | undefined = await userService.fetchUserByUsername(
    credential.username,
    {
      withPassword: true,
    }
  );

  if (user) {
    debug('Matching password.');
    const passwordMatched: boolean = await compare(
      credential.password,
      user.password ?? ''
    );

    if (passwordMatched) {
      return {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    }
  }

  return;
}

export async function authenticate(
  tokenCred: TokenCredential
): Promise<User | undefined> {
  debug('Check if access token exists.');
  if (!tokenCred.accessToken) {
    return;
  }

  debug('Check if token is not revoked.');
  const token: Tokens | undefined = await tokenService.fetchTokenByAccessToken(
    tokenCred.accessToken
  );

  if (token) {
    debug('Check if user exists.');
    const user: User | undefined = await userService.fetchUserById(
      token.user_id,
      {
        withPassword: true,
      }
    );

    if (user) {
      debug('Check if the tokens are valid.');
      const [isAccessTokenValid, _] = verifyTokenSign(tokenCred, user);

      if (isAccessTokenValid) {
        return user;
      }
    }
  }

  return;
}

export default {
  login,
  createNewUser,
  authenticate,
};
