import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdColumnToExternalSystemTable1605878391855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE global."external_system_auth" ADD "userId" VARCHAR(255) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('external_system_auth', 'userId');
  }
}
