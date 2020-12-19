import Debug, { Debugger } from 'debug';

import userService from './users';
import User from '../models/User';
import { NewUser } from '../domain/NewUser';
import { hash, compare } from '../utils/hash';
import { verifyAndDecodeAccessToken } from '../utils/tokens';
import AccessTokenPayload from '../domain/AccessTokenPayload';
import { LoginCredential, TokenCredential } from '../domain/login';

const debug: Debugger = Debug('threedify:services:userAuth');

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

  debug('Check if the access token is valid.');
  const payload = verifyAndDecodeAccessToken(
    tokenCred.accessToken
  ) as AccessTokenPayload;

  if (payload) {
    debug('Check if user exists.');
    const user: User | undefined = await userService.fetchUserById(
      payload.data.id
    );

    if (user) {
      return user;
    }
  }

  return;
}

export default {
  login,
  createNewUser,
  authenticate,
};
