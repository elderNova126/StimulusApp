import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FullNameContactField1677871125772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contact',
      new TableColumn({ name: 'fullName', type: 'varchar', length: '200', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contact', 'fullName');
  }
}
