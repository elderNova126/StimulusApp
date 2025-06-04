import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableTCRAddsupplierTier1673449057988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE global."tenant_company_relationship" ADD "supplierTier" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE global."tenant_company_relationship" DROP COLUMN "supplierTier"`);
  }
}
