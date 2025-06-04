import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddTableCompanyName1691439185486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'company_names',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'companyId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created',
            type: 'datetime2',
            isNullable: false,
            default: 'getdate()',
          },
          {
            name: 'updated',
            type: 'datetime2',
            isNullable: false,
            default: 'getdate()',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_company_names_companyId',
            columnNames: ['companyId'],
            referencedTableName: 'company',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'company_names',
      new TableIndex({
        name: 'IDX_company_names_companyId',
        columnNames: ['companyId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('company_names', 'IDX_company_names_companyId');
    await queryRunner.dropTable('company_names');
  }
}
