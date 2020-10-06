import { Config } from 'knex';
import { config } from 'dotenv';
config();

const knexConfig: Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export default knexConfig;
