import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apps', (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary();
    table.string('name').notNullable();
    table.string('domain').notNullable();
    table.string('key', 2000).notNullable().unique();
    table.string('secret', 2000).notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('apps');
}
