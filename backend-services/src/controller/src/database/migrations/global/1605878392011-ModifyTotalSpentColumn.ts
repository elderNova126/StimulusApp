import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTotalSpentColumn1605878392011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE global."tenant_company_relationship" ALTER COLUMN "totalSpent" bigint NULL`);

    await queryRunner.query(`ALTER TABLE global."tenant_company_relationship" ADD  DEFAULT 0 FOR totalSpent;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE global."tenant_company_relationship" ALTER COLUMN "totalSpent" integer`);
  }
}
