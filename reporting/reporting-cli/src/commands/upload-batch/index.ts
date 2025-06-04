import 'dotenv/config'
import { Command, Flags } from '@oclif/core'
import * as fs from 'fs/promises'
import Upload from '../upload/index'
import * as shell from 'shelljs'
import * as path from 'path'

export default class UploadBatch extends Command {
  static description = 'Batch upload report'

  static examples = [
    `$ upload-batch ../TenantReport.pbix TenantReport ../tenants.json --env DEV
    ReportId: e0eae27e-f1db-47d9-94a9-e9c710eec47d
    WorkspaceId: 77d91d06-96f0-4ed0-9c61-1c0d0b950f85`,
  ]

  static flags = {
    reportPath: Flags.string({ description: 'Path to pbix file', required: true }),
    reportName: Flags.string({ description: 'Report name', required: true }),
    tenantsFilePath: Flags.string({ description: 'Tenats file path', required: true }),
    verbose: Flags.boolean({ description: 'Verbose', required: false, default: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(UploadBatch)
    const {
      reportPath, reportName, tenantsFilePath,
      verbose
    } = flags;
    const rawTenantsData = await fs.readFile(tenantsFilePath);
    const tenants = JSON.parse(rawTenantsData.toString('utf-8'));
    const reportDataPromises = new Array();
    const binPath = path.resolve(process.cwd(), './bin/run');
    const resolvedReportPath = path.resolve(process.cwd(), reportPath);

    const tenantMap = new Map();
    for (const tenant of tenants) {
      tenantMap.set(tenant.id, tenant);
      let uploadCommad = `${binPath} upload --reportPath ${resolvedReportPath} --reportName ${reportName} --tenantName ${tenant.name.replace(/\s+/g, '_')} --dbTenantSchema ${tenant.dbSchema} --dbTenantId ${tenant.id} --jsonOutput`;
      this.log(uploadCommad);
      reportDataPromises.push(
        new Promise((resolve) => {
          shell.exec(uploadCommad, {
            silent: !verbose,
            fatal: true
          }, (code, stdout, stderr) => {
            const jsonResult = JSON.parse(stdout);
            resolve(jsonResult);
          });
        }));
    }
    const reportDataResults = await Promise.all(reportDataPromises);
    const tenantsResult = new Array();
    for (const reportDataResult of reportDataResults) {
      let tenant = tenantMap.get(reportDataResult.tenantId);
      delete reportDataResult.tenantId;
      tenant = { ...tenant, ...reportDataResult };
      tenantsResult.push(tenant);
    }
    const stringOutput = JSON.stringify(tenantsResult);
    await fs.writeFile(tenantsFilePath, stringOutput);
  }
}
