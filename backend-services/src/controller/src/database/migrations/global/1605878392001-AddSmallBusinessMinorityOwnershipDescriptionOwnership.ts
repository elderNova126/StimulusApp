import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SmallBusinessMinorityOwnershipDescriptionOwnershipFields1605878392001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('company', new TableColumn({ name: 'smallBusiness', type: 'bit', isNullable: true }));
    await queryRunner.addColumn(
      'company',
      new TableColumn({ name: 'ownershipDescription', type: 'varchar', length: 'max', isNullable: true })
    );
    await queryRunner.addColumn(
      'company',
      new TableColumn({ name: 'minorityOwnershipDetail', type: 'varchar', length: '200', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('company', 'smallBusiness');
    await queryRunner.dropColumn('company', 'ownershipDescription');
    await queryRunner.dropColumn('company', 'minorityOwnershipDetail');
  }
}
