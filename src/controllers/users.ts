import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import User from '../domain/users';
import userService from '../services/users';

const debug: Debugger = Debug('threedify:controller:users');

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    let users: User[] | undefined = await userService.fetchAllUsers();

    if (users) {
      res.json(users);
      return;
    }

    next({
      status: 404,
      message: 'Users not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching users.',
      ...err,
    });
  }
}

export async function user(req: Request, res: Response, next: NextFunction) {
  try {
    let user: User | undefined = await userService.fetchUserById(
      +req.params.userId
    );

    if (user) {
      res.json(user);
      return;
    }

    next({
      status: 404,
      message: 'User not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching user.',
      ...err,
    });
  }
}

export default {
  index,
  user,
};
