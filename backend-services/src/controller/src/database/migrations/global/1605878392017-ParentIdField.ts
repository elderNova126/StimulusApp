import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ParentIdField1605878392017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'company',
      new TableColumn({ name: 'parentCompanyTaxId', type: 'nvarchar', isNullable: true, length: '127' })
    );

    await queryRunner.query(`
    UPDATE c
    SET c.parentCompanyTaxId = pc.taxIdNo
    FROM global."company" c
    JOIN global."company" pc ON c.parentCompanyId = pc.id
    WHERE c.parentCompanyId IS NOT NULL;
    `);

    await queryRunner.query(`
      DROP INDEX REL_cae9f987ee72fd68e0131aab48 ON global."company";
    `);

    await queryRunner.query(`
    CREATE NONCLUSTERED INDEX REL_cae9f987ee72fd68e0131aab48 ON global.company (  parentCompanyId ASC  )  
    WHERE  ([parentCompanyId] IS NOT NULL)
    WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
    ON [PRIMARY ] ;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('company', 'parentCompanyTaxId');
  }
}
