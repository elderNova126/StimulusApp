import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TreeProject1673448806395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'project_tree',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'projectId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'parentProjectId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'entityType',
            type: 'varchar',
            isNullable: false,
            enum: ['COMPANY', 'TENANT'],
          },
          {
            name: 'entityId',
            type: 'varchar',
            isNullable: false,
          },
          // "mpath" varchar(255) CONSTRAINT "DF_ce84c0850056bf13d5e13aff749" DEFAULT ''
          {
            name: 'mpath',
            type: 'varchar',
            isNullable: true,
          },
        ],

        indices: [
          {
            name: 'IX_project_tree_projectId',
            columnNames: ['projectId'],
          },
          {
            name: 'IX_project_tree_parentProjectId',
            columnNames: ['parentProjectId'],
          },
          {
            name: 'IX_project_tree_entityId',
            columnNames: ['entityId'],
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
