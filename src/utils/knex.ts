import Knex from 'knex';

import config from '../../knexfile';

const INSTANCE: Knex = Knex(config);

export function knex(): Knex {
  return INSTANCE;
}

export default knex;
