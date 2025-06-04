import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SharedList1605878391738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dec

    await queryRunner.createTable(
      new Table({
        name: 'shared_lists',
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
            name: 'listId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            enum: ['pending', 'accepted', 'declined', 'deleted'],
          },
          {
            name: 'createdBy',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('shared_lists');
  }
}
