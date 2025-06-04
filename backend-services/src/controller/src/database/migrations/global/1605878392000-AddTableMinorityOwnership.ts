import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class MinorityOwnershipRelation1605878392000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'minorityOwnershipDetail',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'minorityOwnershipDetail',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'minorityOwnershipDetail_company',
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
            name: 'minorityOwnershipDetailId',
            type: 'uniqueidentifier',
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
    await queryRunner.createForeignKey(
      'minorityOwnershipDetail_company',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
      })
    );
    await queryRunner.createForeignKey(
      'minorityOwnershipDetail_company',
      new TableForeignKey({
        columnNames: ['minorityOwnershipDetailId'],
        referencedTableName: 'minorityOwnershipDetail',
        referencedColumnNames: ['id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('minorityOwnershipDetail_company');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('companyId') !== -1);
    await queryRunner.dropForeignKey('minorityOwnershipDetail_company', foreignKey);
    const foreignKey2 = table.foreignKeys.find((fk) => fk.columnNames.indexOf('minorityOwnershipDetailId') !== -1);
    await queryRunner.dropForeignKey('minorityOwnershipDetail_company', foreignKey2);
    queryRunner.dropTable('minorityOwnershipDetail_company');
    queryRunner.dropTable('minorityOwnershipDetail');
  }
}
