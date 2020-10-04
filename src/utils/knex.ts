import Knex from 'knex';

import config from '../../knexfile';

export function knex(): Knex {
  return Knex(config);
}

export default knex;
