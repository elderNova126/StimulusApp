import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ApiKeyAuthentication1605878391899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'external_system_auth',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'tenantId',
            type: 'uniqueidentifier',
            isNullable: false,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'apiKey',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '200',
            default: null,
          },
          {
            name: 'status',
            type: 'varchar',
            enum: ['active', 'inactive'],
          },
          {
            name: 'created',
            type: 'datetime2',
            isNullable: false,
            default: 'getdate()',
          },
          {
            name: 'expire',
            type: 'datetime2',
            isNullable: true,
          },
        ],
      }),
      true,
      true,
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('external_system_auth');
  }
}
