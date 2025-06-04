import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBadges1605878392010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'badge',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'badgeName',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'badgeDescription',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'badgeDateStatus',
            type: 'varchar',
            enum: ['hidden', 'optional', 'mandatory'],
            default: "'mandatory'",
            isNullable: false,
          },
          {
            name: 'badgeDateLabel',
            type: 'varchar',
            length: '30',
            isNullable: true,
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
          {
            name: 'tenantId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'badge',
      new TableForeignKey({
        columnNames: ['tenantId'],
        referencedTableName: 'tenant',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'badge_tenant_company_relationship',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'badgeDate',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'badgeId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
          {
            name: 'tenantCompanyRelationshipId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['badgeId'],
            referencedTableName: 'badge',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['tenantCompanyRelationshipId'],
            referencedTableName: 'tenant_company_relationship',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('badge_tenant_company_relationship');
    await queryRunner.dropTable('badge');
  }
}
