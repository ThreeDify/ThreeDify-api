import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary();
    table.string('username').notNullable().unique();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
