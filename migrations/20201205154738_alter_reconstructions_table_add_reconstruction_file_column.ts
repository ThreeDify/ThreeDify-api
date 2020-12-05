import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(
    'reconstructions',
    (table: Knex.AlterTableBuilder) => {
      table.string('reconstruction_file').nullable();
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(
    'reconstructions',
    (table: Knex.AlterTableBuilder) => {
      table.dropColumn('reconstruction_file');
    }
  );
}
