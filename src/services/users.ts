import Debug, { Debugger } from 'debug';

import knex from '../utils/knex';
import { User } from '../domain/users';

const debug: Debugger = Debug('threedify:services:users');

const selectColumns = ['id', 'first_name', 'last_name', 'username'];

interface UserColumnSelection {
  withEmail?: boolean;
  withPassword?: boolean;
  withTimestamps?: boolean;
}

function getSelectColumns(config?: UserColumnSelection): string[] {
  const { withPassword, withEmail, withTimestamps } = {
    withPassword: false,
    withEmail: false,
    withTimestamps: false,
    ...config,
  };
  const columns: string[] = [...selectColumns];

  if (withPassword) {
    columns.push('password');
  }

  if (withEmail) {
    columns.push('email');
  }

  if (withTimestamps) {
    columns.push('created_at', 'updated_at');
  }

  return columns;
}

export async function fetchAllUsers(
  config?: UserColumnSelection
): Promise<User[] | undefined> {
  debug('Fetching all users.');

  return await knex().select(getSelectColumns(config)).from<User>('users');
}

export async function fetchUserById(
  id: number,
  config?: UserColumnSelection
): Promise<User | undefined> {
  debug('Fetching user with id: %d.', id);

  return await knex()
    .select(getSelectColumns(config))
    .from<User>('users')
    .where('id', '=', id)
    .first();
}

export async function fetchUserByEmail(
  email: string,
  config?: UserColumnSelection
): Promise<User | undefined> {
  debug('Fetching user with email: %s.', email);

  return await knex()
    .select(getSelectColumns(config))
    .from<User>('users')
    .where('email', '=', email)
    .first();
}

export async function fetchUserByUsername(
  username: string,
  config?: UserColumnSelection
): Promise<User | undefined> {
  debug('Fetching user with username: %s.', username);

  return await knex()
    .select(getSelectColumns(config))
    .from<User>('users')
    .where('username', '=', username)
    .first();
}

export async function insertUser(user: User): Promise<number> {
  debug('Inserting user.');

  return +(await knex()('users').returning('id').insert<User>(user));
}

export default {
  insertUser,
  fetchAllUsers,
  fetchUserById,
  fetchUserByEmail,
  fetchUserByUsername,
};
