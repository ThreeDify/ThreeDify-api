import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import packageJson from '../../package.json';
import APIDescription from '../domain/APIDescription';

const debug: Debugger = Debug('threedify:controller:home');

export function index(
  request: Request,
  response: Response<APIDescription>,
  next: NextFunction
): void {
  response.json({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  });
}

export default {
  index,
};
