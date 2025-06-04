import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class DiverseOwnershipRelation1605878391840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diverseOwnership',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'diverseOwnership',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'created',
            type: 'datetime2',
            isNullable: false,
            default: 'getdate()',
          },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'diverseOwnership_company',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'companyId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
          {
            name: 'diverseOwnershipId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
        ],
      }),
      true,
      true,
      true
    );
    await queryRunner.createForeignKey(
      'diverseOwnership_company',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
      })
    );
    await queryRunner.createForeignKey(
      'diverseOwnership_company',
      new TableForeignKey({
        columnNames: ['diverseOwnershipId'],
        referencedTableName: 'diverseOwnership',
        referencedColumnNames: ['id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('diverseOwnership_company');
    queryRunner.dropTable('diverseOwnership');
  }
}
