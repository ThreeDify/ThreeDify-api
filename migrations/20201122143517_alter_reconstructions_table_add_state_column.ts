import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(
    'reconstructions',
    (table: Knex.AlterTableBuilder) => {
      table
        .enu('state', ['INQUEUE', 'INPROGRESS', 'COMPLETED'], {
          useNative: true,
          enumName: 'ReconstructionState',
        })
        .defaultTo('INQUEUE');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(
    'reconstructions',
    (table: Knex.AlterTableBuilder) => {
      table.dropColumn('state');
    }
  );

  await knex.schema.raw('DROP TYPE "ReconstructionState";');
}
