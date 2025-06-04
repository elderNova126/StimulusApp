import { MigrationInterface, QueryRunner } from 'typeorm';

export class RevokeTestUsers1731089614428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const emails = [
        'nelg30ayoxa9yi@qejjyl.com',
        '04g7qchju214@zlorkun.com',
        '9xo5v4clmxrih@bltiwd.com',
        'x5wne3qrmuvilg@knmcadibav.com',
        'ufqhzsbyiv7e@zvvzuv.com',
      ];

      const emailList = emails.map((email) => `'${email}'`).join(',');
      const findUserQuery = `
        SELECT id, email
        FROM [global].[user]
        WHERE email IN (${emailList});
      `;
      const users = await queryRunner.query(findUserQuery);

      for (const user of users) {
        const userId = user.id;
        const revokeUserTenantQuery = `
          DELETE FROM [global].[user_tenant]
          WHERE userId = '${userId}';
        `;

        await queryRunner.query(revokeUserTenantQuery);
      }
    } catch (err) {
      throw err;
    }
  }

  public async down(): Promise<void> {
    //nothing
  }
}
