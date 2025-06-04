import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnTOComopanyAttachmentTable1727192343442 implements MigrationInterface {
  name = 'AddTypeColumnTOComopanyAttachmentTable1727192343442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "global"."company_attachment" ADD "type" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "global"."company_attachment" DROP COLUMN "type"`);
  }
}
