import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNativeAmericanRowOnDiverseOwnerShip1727367437581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "global"."diverseOwnership" (diverseOwnership, created) 
       VALUES ('Native American', GETDATE());`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM [global].[diverseOwnership] 
     WHERE diverseOwnership = 'Native American';`
    );
  }
}
