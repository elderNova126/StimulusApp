import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class CreateStimulusIdColumnAndIndex1632897180053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'company',
      new TableColumn({ name: 'stimulusId', type: 'uniqueidentifier', default: 'NEWID()' })
    );

    await queryRunner.createIndex(
      'company',
      new TableIndex({
        name: 'IDX_Stimulus_StimulusID',
        columnNames: ['stimulusId'],
        isUnique: true,
        where: '[stimulusId] IS NOT NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('company', 'IDX_Stimulus_StimulusID');

    await queryRunner.dropColumn('company', 'stimulusId');
  }
}
