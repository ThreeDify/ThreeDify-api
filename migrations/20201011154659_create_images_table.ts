import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('images', (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary();
    table.string('file_name').notNullable().unique();
    table.string('mimetype').notNullable();
    table.bigInteger('uploaded_by').notNullable();
    table.foreign('uploaded_by').references('users.id');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('images');
}
