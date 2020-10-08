import Debug, { Debugger } from 'debug';

import userService from './users';
import hash, { compare } from '../utils/hash';
import User, { NewUser } from '../domain/users';

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

export default {
  createNewUser,
};
