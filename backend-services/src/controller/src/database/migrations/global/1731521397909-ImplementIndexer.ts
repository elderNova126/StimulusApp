import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImplementIndexer1731521397909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IDX_IS_FAVORITE
      ON [global].[tenant_company_relationship] (isFavorite);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IDX_IS_FAVORITE
      ON [global].[tenant_company_relationship];
    `);
  }
}
