import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'reconstructions',
    (table: Knex.CreateTableBuilder) => {
      table.bigIncrements('id').primary();
      table.string('name').notNullable();
      table.bigInteger('created_by').notNullable();
      table.foreign('created_by').references('users.id');
      table.timestamps(false, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reconstructions');
}
