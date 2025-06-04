import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterFKCompanyId1605878391999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey('asset_relation', 'FK_ac1303b9ac1eccac844c1ab6db4');
    // await queryRunner.createForeignKey(
    //   'asset_relation',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('company_tags_tags', 'FK_5db3564acc113412ab1513d4458');
    // await queryRunner.createForeignKey(
    //   'company_tags_tags',
    //   new TableForeignKey({
    //     name: 'FK_5db3564acc113412ab1513d4458A',
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('location', 'FK_ca22cf0a0a6c6b26456196fb418');
    // await queryRunner.createForeignKey(
    //   'location',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('contact', 'FK_bf2de735fe9e77f098e45e3aa11');
    // await queryRunner.createForeignKey(
    //   'contact',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('data_point', 'FK_9772565e15988d0f49aed63acdf');
    // await queryRunner.createForeignKey(
    //   'data_point',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('product', 'FK_e3d018d0445e76123dc4ab46829');
    // await queryRunner.createForeignKey(
    //   'product',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('certification', 'FK_681d806d20401494bb86b77eb23');
    // await queryRunner.createForeignKey(
    //   'certification',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('contingency', 'FK_88efb074a59a60c9372e8df23d7');
    // await queryRunner.createForeignKey(
    //   'contingency',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('insurance', 'FK_c26b194b7195cf2b0f00284de1c');
    // await queryRunner.createForeignKey(
    //   'insurance',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('score', 'FK_3b1b60968afdc99b04d2bec13f1');
    // await queryRunner.createForeignKey(
    //   'score',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.createForeignKey(
    //   'rowversion_index',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    // await queryRunner.dropForeignKey('diverseOwnership_company', 'FK_544f58fed1fb06eb57dc560fd2a');
    // await queryRunner.createForeignKey(
    //   'diverseOwnership_company',
    //   new TableForeignKey({
    //     columnNames: ['companyId'],
    //     referencedTableName: 'company',
    //     referencedColumnNames: ['id'],
    //     onDelete: 'CASCADE'
    //   })
    // );

    await queryRunner.dropForeignKey('tenant_company_relationship', 'FK_d3f3f9719659326e40eaa1d9083');
    await queryRunner.createForeignKey(
      'tenant_company_relationship',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
