import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import authService from '../services/auth';
import { User, NewUser } from '../domain/users';

const debug: Debugger = Debug('threedify:controller:auth');

export async function register(
  req: Request<{}, any, NewUser>,
  res: Response<User>,
  next: NextFunction
) {
  try {
    let user: User | undefined = await authService.createNewUser(req.body);

    if (user) {
      res.json(user);
      return;
    }

    throw new Error('Error while creating user.');
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while creating user.',
      ...err,
    });
  }
}

export default {
  register,
};
