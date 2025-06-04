import 'dotenv/config'
import { Command, Flags } from '@oclif/core'
import * as fs from 'fs/promises'
import * as shell from 'shelljs'
import * as path from 'path'

export default class Deploy extends Command {
  static description = 'Deploy reports'

  static examples = [
  ]

  static flags = {
    reportsPath: Flags.string({ description: 'Path to output json file', required: true, env: 'REPORTS_PATH' }),
    reportsIndexFilePath: Flags.string({ description: 'Path to output json file', required: true, env: 'REPORTS_INDEX_PATH' }),
    verbose: Flags.boolean({ char: 'v', description: 'Verbose', default: false}),
  }

  static readonly tenantsFilePath = '../tenants.json';

  private executeCommand(command: string, verbose: boolean): void {
    this.log(command);

    shell.exec(command, {
      fatal: true,
      silent: !verbose
    });
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Deploy)
    const {
      reportsIndexFilePath, reportsPath,
      verbose
    } = flags;
    const rawReportsData = await fs.readFile(reportsIndexFilePath);
    const reportsData = JSON.parse(rawReportsData.toString('utf-8'));

    const binPath = path.resolve(process.cwd(), './bin/run');

    for (const reportData of reportsData) {

      const {
        name,
        code,
        type,
        pbixFile
      } = reportData;

      let tenantListCommad = `${binPath} tenant-list --jsonOutputPath ${Deploy.tenantsFilePath}`;

      this.executeCommand(tenantListCommad, verbose);

      const reportPath = path.resolve(reportsPath, pbixFile);

      let uploadBatchCommad = `${binPath} upload-batch --reportPath ${reportPath} --reportName ${name} --tenantsFilePath ${Deploy.tenantsFilePath}`;
      if (verbose) {
        uploadBatchCommad += ' --verbose'
      }

      this.executeCommand(uploadBatchCommad, verbose);

      let tenantUpdateCommand = `${binPath} tenant-update --tenantsFilePath ${Deploy.tenantsFilePath} --reportCode ${code} --reportType ${type}`;
      if (verbose) {
        uploadBatchCommad += ' --verbose'
      }

      this.executeCommand(tenantUpdateCommand, verbose);

      await fs.unlink(Deploy.tenantsFilePath);
    }
  }
}
