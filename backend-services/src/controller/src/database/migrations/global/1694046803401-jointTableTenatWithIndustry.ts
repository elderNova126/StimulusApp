import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
export class jointTableTenatWithIndustry1694046803401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenant_industry',
        columns: [
          {
            name: 'tenantId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
          {
            name: 'industryId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'tenant_industry',
      new TableForeignKey({
        columnNames: ['tenantId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'tenant_industry',
      new TableForeignKey({
        columnNames: ['industryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tenant_industry');
    const tenantIdForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('tenantId') !== -1);
    const industryIdForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('industryId') !== -1);
    await queryRunner.dropForeignKey('tenant_industry', tenantIdForeignKey);
    await queryRunner.dropForeignKey('tenant_industry', industryIdForeignKey);
    await queryRunner.dropTable('tenant_industry');
  }
}
