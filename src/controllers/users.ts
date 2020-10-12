import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import User from '../models/User';
import userService from '../services/users';
import UserResponse from '../domain/UserResponse';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const debug: Debugger = Debug('threedify:controller:users');

export async function index(
  req: Request,
  res: Response<UserResponse[]>,
  next: NextFunction
) {
  try {
    let users: User[] | undefined = await userService.fetchAllUsers();

    if (users) {
      res.json(
        users.map((user) => {
          return {
            id: user.id,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
          };
        })
      );
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
  res: Response<UserResponse>,
  next: NextFunction
) {
  try {
    let user: User | undefined = await userService.fetchUserById(
      +req.params.userId
    );

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
      });
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
  res: Response<UserResponse>,
  next: NextFunction
) {
  const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
  res.json({
    id: authReq.user.id,
    username: authReq.user.username,
    first_name: authReq.user.firstName,
    last_name: authReq.user.lastName,
  });
}

export default {
  me,
  user,
  index,
};
