import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import User from '../domain/users';
import userService from '../services/users';

const debug: Debugger = Debug('threedify:controller:users');

export async function index(req: Request, res: Response, next: NextFunction) {
  let users: User | User[] = await userService.fetchAllUsers();

  res.json(users);
}

export async function user(req: Request, res: Response, next: NextFunction) {
  let user: User | undefined = await userService.fetchUserById(
    +req.params.userId
  );

  res.json(user);
}

export default {
  index,
  user,
};
