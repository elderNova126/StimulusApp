import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class Tags1605878391987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('notification', 'FK_4d8dd208e427731306a6be66add');
    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['eventId'],
        referencedTableName: 'event',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
