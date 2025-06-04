import { Command, Flags } from '@oclif/core';
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as sql from 'mssql';

export default class TenantUpdate extends Command {
  static description = 'Update tenants';

  static examples = [`$ `];

  static flags = {
    tenantsFilePath: Flags.string({ description: 'Tenats file path', required: true }),
    reportCode: Flags.string({ description: 'Report code', required: true }),
    reportType: Flags.string({ description: 'Report type', required: true }),

    opDbConnectionString: Flags.string({
      description: 'Operational Db connection string',
      required: true,
      env: 'OPERATIONAL_DB_CONNECTION_STRING'
    }),
    verbose: Flags.boolean({ description: 'Verbose', required: false, default: false })
  };

  private async getMergeTenantReportStatement(tenantSchema: string): Promise<sql.PreparedStatement> {
    const ps = new sql.PreparedStatement();
    ps.input('reportType', sql.VarChar);
    ps.input('reportCode', sql.VarChar);
    ps.input('workspaceId', sql.VarChar);
    ps.input('reportId', sql.VarChar);
    try {
      await ps.prepare(`
      MERGE [${tenantSchema}].[report] AS [Target] USING
        (SELECT reportCode = @reportCode,
                reportType = @reportType,
                reportId = @reportId,
                workspaceId = @workspaceId) AS [Source] ON [Target].code = [Source].reportCode
      AND [Target].type = [Source].reportType WHEN MATCHED THEN
      UPDATE
      SET [Target].reportId = [Source].reportId,
          [Target].workspaceId=[Source].workspaceId,
          [Target].updated = GetDate() WHEN NOT MATCHED THEN
      INSERT (code,
              type,
              reportId,
              workspaceId)
      VALUES ([Source].reportCode, [Source].reportType, [Source].reportId, [Source].workspaceId);`);
    } catch (e) {
      if (ps.prepared) {
        await ps.unprepare();
      }
      throw e;
    }
    return ps;
  }

  private async updateTenantReportData(tenant: any, reportCode: string, reportType: string): Promise<any> {
    console.log(`Updating tenant report data for tenant ${tenant.name} (${tenant.id})`);
    const ps = await this.getMergeTenantReportStatement(tenant.dbSchema);
    const result = await ps.execute({
      reportType,
      reportCode,
      reportId: tenant.reportId,
      workspaceId: tenant.workspaceId
    });
    await ps.unprepare();
    return {
      id: tenant.id,
      ...result
    };
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TenantUpdate);
    const { tenantsFilePath, reportCode, reportType, opDbConnectionString, verbose } = flags;

    const connection = await sql.connect(opDbConnectionString);

    const rawTenantsData = await fs.readFile(tenantsFilePath);
    const tenants = JSON.parse(rawTenantsData.toString('utf-8'));

    const tenantReportUpdatePromises = new Array();

    for (const tenant of tenants) {
      const tenantReportUpdatePromise = this.updateTenantReportData(tenant, reportCode, reportType).catch((e) => {
        if (verbose) {
          console.error(e);
        }
        return {
          id: tenant.id,
          ...e
        };
      });
      tenantReportUpdatePromises.push(tenantReportUpdatePromise);
    }

    const tenantReportUpdateResults = await Promise.all(tenantReportUpdatePromises);
    console.log(JSON.stringify(tenantReportUpdateResults));
    await connection.close();
  }
}
