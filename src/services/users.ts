import Debug, { Debugger } from 'debug';

import knex from '../utils/knex';
import hash from '../utils/hash';

import { User, NewUser } from '../domain/users';

const debug: Debugger = Debug('threedify:services:users');

export async function fetchAllUsers(): Promise<User | User[]> {
  debug('Fetching all users.');

  return await knex().select('*').from<User>('users');
}

export async function fetchUserById(id: number): Promise<User | undefined> {
  debug('Fetching user with id: %d.', id);

  return await knex()
    .select('*')
    .from<User>('users')
    .where('id', '=', id)
    .first();
}

export async function createNewUser(
  newUser: NewUser
): Promise<User | undefined> {
  debug('Creating new user.');

  debug('Hashing user password.');
  const hashedPassword: string = hash(newUser.rawPassword);

  const user: User = {
    email: newUser.email,
    password: hashedPassword,
    username: newUser.username,
    last_name: newUser.last_name,
    first_name: newUser.first_name,
  };

  const userId: number = +(await knex()('users').returning('id').insert(user));
  debug('User inserted successful.');

  return await fetchUserById(userId);
}

export default {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
};
