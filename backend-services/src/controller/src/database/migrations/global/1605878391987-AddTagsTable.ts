import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Tags1605878391987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dec

    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            default: 'newsequentialid()',
            isGenerated: true,
          },
          {
            name: 'tag',
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
        name: 'company_tags_tags',
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
            name: 'tagsId',
            type: 'uniqueidentifier',
            isNullable: false,
          },
        ],
      }),
      true,
      true,
      true
    );
    // create foreign key
    await queryRunner.createForeignKey(
      'company_tags_tags',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
      })
    );
    await queryRunner.createForeignKey(
      'company_tags_tags',
      new TableForeignKey({
        columnNames: ['tagsId'],
        referencedTableName: 'tags',
        referencedColumnNames: ['id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('company_tags_tags');
    queryRunner.dropTable('tags');
  }
}
