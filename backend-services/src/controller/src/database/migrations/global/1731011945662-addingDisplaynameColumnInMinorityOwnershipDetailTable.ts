import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addingDisplaynameColumnInMinorityOwnershipDetailTable1731011945662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'minorityOwnershipDetail',
      new TableColumn({
        name: 'displayName',
        type: 'nvarchar',
        isNullable: false,
        default: "'Default Display Name'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('minorityOwnershipDetail', 'displayName');
  }
}
