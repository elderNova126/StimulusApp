import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddTableProjectSupplier1673448911103 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'project_suppliers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'globalProjectId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'companyId',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['globalProjectId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'project_tree',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
      true,
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[global].[project_suppliers]') AND type in (N'U'))
                                DROP TABLE [global].[project_suppliers]
                                GO`);
  }
}
