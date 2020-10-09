import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tokens', (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary();
    table.string('access_token').notNullable().unique();
    table.string('refresh_token').notNullable().unique();
    table.bigInteger('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tokens');
}
