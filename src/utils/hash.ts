import { createHash, Hash } from 'crypto';
import Debug, { Debugger } from 'debug';

import config from '../config';

const debug: Debugger = Debug('threedify:utils:hash');

export function hash(data: string): string {
  debug('Using %s algorithm for hash.', config.hashAlgo);
  const hasher: Hash = createHash(config.hashAlgo);

  hasher.update(data);

  return hasher.digest('hex');
}

export default hash;
