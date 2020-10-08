import bcrypt from 'bcrypt';
import Debug, { Debugger } from 'debug';

import config from '../config';

const debug: Debugger = Debug('threedify:utils:hash');

export async function hash(data: string): Promise<string> {
  debug('Hashing password.');

  return await bcrypt.hash(data, config.saltRound);
}

export async function compare(data: string, hash: string): Promise<boolean> {
  debug('Comparing hash with raw data.');

  return await bcrypt.compare(data, hash);
}

export default hash;
