import { QueryRunner } from 'typeorm';

export class SetNullAllAutomaticTaxIds1632897180052 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global.company
        SET taxIdNo = NULL
        WHERE CHARINDEX('ZZ:', taxIdNo) > 0;
    `);
  }
}
