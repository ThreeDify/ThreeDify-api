import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import userService from '../services/users';
import { User, NewUser } from '../domain/users';

const debug: Debugger = Debug('threedify:controller:auth');

export async function register(
  req: Request<{}, any, NewUser>,
  res: Response,
  next: NextFunction
) {
  let user: User | undefined = await userService.createNewUser(req.body);

  res.json(user);
}

export default {
  register,
};
