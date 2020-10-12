import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import packageJson from '../../package.json';

const debug: Debugger = Debug('threedify:controller:home');

export interface HomeControllerResponse {
  name: string;
  version: string;
  description: string;
}

function index(
  request: Request,
  response: Response<HomeControllerResponse>,
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
