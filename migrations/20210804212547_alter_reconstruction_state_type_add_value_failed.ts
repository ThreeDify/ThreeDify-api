import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE "ReconstructionState_temp" AS ENUM ('INQUEUE', 'INPROGRESS', 'COMPLETED', 'FAILED');
    ALTER TABLE reconstructions
      ALTER COLUMN state DROP DEFAULT,
      ALTER COLUMN state TYPE "ReconstructionState_temp" USING state::text::"ReconstructionState_temp",
      ALTER COLUMN state SET DEFAULT 'INQUEUE';
    DROP TYPE IF EXISTS "ReconstructionState";
    ALTER TYPE "ReconstructionState_temp" RENAME TO "ReconstructionState";
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE reconstructions SET state='INQUEUE' WHERE state='FAILED';
    CREATE TYPE "ReconstructionState_temp" AS ENUM ('INQUEUE', 'INPROGRESS', 'COMPLETED');
    ALTER TABLE reconstructions
      ALTER COLUMN state DROP DEFAULT,
      ALTER COLUMN state TYPE "ReconstructionState_temp" USING state::text::"ReconstructionState_temp",
      ALTER COLUMN state SET DEFAULT 'INQUEUE';
    DROP TYPE IF EXISTS "ReconstructionState";
    ALTER TYPE "ReconstructionState_temp" RENAME TO "ReconstructionState";
  `);
}
