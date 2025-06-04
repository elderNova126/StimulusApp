import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EvaluationsAddedToTCR1605878392002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tenant_company_relationship',
      new TableColumn({ name: 'noOfEvaluations', type: 'integer', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tenant_company_relationship', 'noOfEvaluations');
  }
}
