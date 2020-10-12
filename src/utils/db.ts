import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

import config from '../../knexfile';

const INSTANCE: Knex = Knex({
  ...config,
  ...knexSnakeCaseMappers(),
});

export function knex(): Knex {
  return INSTANCE;
}

export function init() {
  if (Model.knex()) {
    return;
  }

  Model.knex(INSTANCE);
}

export default {
  init,
  knex,
};
