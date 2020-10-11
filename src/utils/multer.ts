import multer, { Multer } from 'multer';
import { RequestHandler } from 'express';

import config from '../config';

const INSTANCE: Multer = multer(config.multerConfig);

export function single(key: string): RequestHandler {
  return INSTANCE.single(key);
}

export function multiple(key: string, max?: number): RequestHandler {
  return INSTANCE.array(key);
}

export default {
  single,
  multiple,
};
