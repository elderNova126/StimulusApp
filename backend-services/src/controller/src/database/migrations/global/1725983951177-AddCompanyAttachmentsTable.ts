import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyAttachmentsTable1725983951177 implements MigrationInterface {
  name = 'AddCompanyAttachmentsTable1725983951177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "global"."company_attachment" ("id" int NOT NULL IDENTITY(1,1), "createdBy" nvarchar(255), "filename" nvarchar(255), "originalFilename" nvarchar(255), "size" int, "url" nvarchar(255), "isPrivate" bit NOT NULL CONSTRAINT "DF_bd1a7d13a042b3cb21f00cfda5f" DEFAULT 0, "created" datetime2 NOT NULL CONSTRAINT "DF_6d41c5e01d010e84c39bffdae4b" DEFAULT getdate(), "updated" datetime2 NOT NULL CONSTRAINT "DF_1dd776057f2add144a839641f7d" DEFAULT getdate(), "companyId" uniqueidentifier NOT NULL, "tenantId" uniqueidentifier, CONSTRAINT "PK_6aed1984453b788330dc6968fb8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "global"."company_attachment" ADD CONSTRAINT "FK_6d975c0ea8109a93970aed59689" FOREIGN KEY ("companyId") REFERENCES "global"."company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "global"."company_attachment" ADD CONSTRAINT "FK_325570903793a3251f25ff61637" FOREIGN KEY ("tenantId") REFERENCES "global"."tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "global"."company_attachment" DROP CONSTRAINT "FK_325570903793a3251f25ff61637"`
    );
    await queryRunner.query(
      `ALTER TABLE "global"."company_attachment" DROP CONSTRAINT "FK_6d975c0ea8109a93970aed59689"`
    );
    await queryRunner.query(`DROP TABLE "global"."company_attachment"`);
  }
}
