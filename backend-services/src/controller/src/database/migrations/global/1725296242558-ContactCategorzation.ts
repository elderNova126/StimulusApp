import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContactCategorzation1725296242558 implements MigrationInterface {
  name = 'ContactCategorzation1725296242558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "global"."contact" ADD "type" varchar(255) NOT NULL CONSTRAINT "DF_5fd8dc11e0ec4b57364aaa0a6c4" DEFAULT 'public'`
    );
    await queryRunner.query(`ALTER TABLE "global"."contact" ADD "tenantId" uniqueidentifier NULL`);
    await queryRunner.query(
      `ALTER TABLE "global"."contact" ADD CONSTRAINT "CHK_contact_type_tenantId" CHECK (("type" = 'public' AND "tenantId" IS NULL) OR ("type" = 'private' AND "tenantId" IS NOT NULL))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "global"."contact" DROP CONSTRAINT "CHK_contact_type_tenantId"`);
    await queryRunner.query(`ALTER TABLE "global"."contact" DROP CONSTRAINT "DF_5fd8dc11e0ec4b57364aaa0a6c4"`);
    await queryRunner.query(`ALTER TABLE "global"."contact" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "global"."contact" DROP COLUMN "type"`);
  }
}
