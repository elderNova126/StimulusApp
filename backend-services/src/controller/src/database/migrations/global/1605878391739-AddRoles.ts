import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

export class AddRoles1605878391739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connectionOptions = queryRunner.connection.options as SqlServerConnectionOptions;

    await queryRunner.query(`
        MERGE [${connectionOptions.schema}].[role] AS target
            USING ( VALUES ('admin', 0, 'Tenant administrator'),
                            ('superadmin', 1, 'Super administrator')
                            )  AS source (name, internal, description )
            ON (target.name = source.name)
            WHEN MATCHED THEN
                UPDATE SET target.name = source.name,
                            target.internal = source.internal,
                            target.description = source.description
            WHEN NOT MATCHED THEN
                INSERT (name, internal, description)
                VALUES (source.name, source.internal, source.description);
        `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
