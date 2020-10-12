import Debug, { Debugger } from 'debug';

import userService from './users';
import User from '../models/User';
import tokenService from './tokens';
import Token from '../models/Token';
import { NewUser } from '../domain/NewUser';
import { hash, compare } from '../utils/hash';
import { verifyTokenSign } from '../utils/tokens';
import { LoginCredential, TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:services:auth');

export async function createNewUser(
  newUser: NewUser
): Promise<User | undefined> {
  debug('Creating new user.');

  debug('Hashing user password.');
  const hashedPassword: string = await hash(newUser.rawPassword);

  const user: Partial<User> = {
    email: newUser.email,
    password: hashedPassword,
    username: newUser.username,
    lastName: newUser.last_name,
    firstName: newUser.first_name,
  };

  debug('Inserting user record.');
  return await userService.insertUser(user);
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
      return user;
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
  const token: Token | undefined = await tokenService.fetchTokenByAccessToken(
    tokenCred.accessToken
  );

  if (token) {
    debug('Check if user exists.');
    const user: User | undefined = await userService.fetchUserById(
      token.userId,
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
