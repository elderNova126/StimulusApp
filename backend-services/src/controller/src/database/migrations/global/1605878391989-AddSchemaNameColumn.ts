import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SchemaName1605878391989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'schemaName',
        type: 'varchar',
        length: '200',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('tenant', 'schemaName');
  }
}
