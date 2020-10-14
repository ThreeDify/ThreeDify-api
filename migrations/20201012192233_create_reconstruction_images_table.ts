import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'reconstruction_images',
    (table: Knex.CreateTableBuilder) => {
      table.bigInteger('reconstruction_id').notNullable();
      table.bigInteger('image_id').notNullable();
      table.foreign('reconstruction_id').references('reconstructions.id');
      table.foreign('image_id').references('images.id');
      table.primary(['reconstruction_id', 'image_id']);
      table.timestamps(false, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reconstruction_images');
}
