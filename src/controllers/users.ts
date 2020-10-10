import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import User from '../domain/users';
import userService from '../services/users';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const debug: Debugger = Debug('threedify:controller:users');

export async function index(
  req: Request,
  res: Response<User[]>,
  next: NextFunction
) {
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

export async function user(
  req: Request,
  res: Response<User>,
  next: NextFunction
) {
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

export async function me(
  req: Request,
  res: Response<User>,
  next: NextFunction
) {
  const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
  res.json(authReq.user);
}

export default {
  me,
  user,
  index,
};
