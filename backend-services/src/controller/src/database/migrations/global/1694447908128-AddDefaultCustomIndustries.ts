import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultCustomIndustries1694447908128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO global.tenant_industry (tenantId, industryId)
      SELECT t.id, i.id
      FROM global.tenant AS t
      JOIN global.industry AS i ON i.code IS NULL
      WHERE t.provisionStatus = 'provisioned';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM global.tenant_industry
      WHERE tenantId IN (
        SELECT t.id
        FROM global.tenant AS t
        JOIN global.industry AS i ON i.code IS NULL
        WHERE t.provisionStatus = 'provisioned'
      );
    `);
  }
}
