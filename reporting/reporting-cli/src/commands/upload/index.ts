import 'dotenv/config'
import { Command, Flags } from '@oclif/core'
import * as shell from 'shelljs'

export default class Upload extends Command {
  static description = 'Upload report'

  static examples = [
    `$ upload ../TenantReport.pbix TenantReport --env DEV --tenantName Test --dbTenantSchema stimulus --dbTenantId 109A16BB-AEF2-EA11-99C3-2818783A8F8D
    ReportId: e0eae27e-f1db-47d9-94a9-e9c710eec47d
    WorkspaceId: 77d91d06-96f0-4ed0-9c61-1c0d0b950f85`,
  ]

  static flags = {
    
    reportPath: Flags.string({ description: 'Path to pbix file', required: true }),
    reportName: Flags.string({ description: 'Report name', required: true }),

    env: Flags.string({ description: 'Environment identifier (DEV, PROD, etc.)', required: true, env: 'REPORTING_ENV' }),
    tenantName: Flags.string({ description: 'Tenant name (Stimulus)', required: true }),

    adPrincipal: Flags.string({ description: 'AD application principal id', required: true, env: 'PBI_AD_PRINCIPAL' }),
    adSecret: Flags.string({ description: 'AD secret', required: true, env: 'PBI_AD_SECRET' }),
    adTenantId: Flags.string({ description: 'AD tenant id', required: true, env: 'PBI_AD_TENANT_ID' }),

    dbTenantSchema: Flags.string({ description: 'Tenant db schema', required: true }),
    dbTenantId: Flags.string({ description: 'Tenant id', required: true }),

    dbServer: Flags.string({ description: 'Db server', required: true, env: 'PBI_DB_SERVER' }),
    dbName: Flags.string({ description: 'Db bane', required: true, env: 'PBI_DB_NAME' }),
    dbUsername: Flags.string({ description: 'Db username', required: true, env: 'PBI_DB_USERNAME' }),
    dbPassword: Flags.string({ description: 'Db password', required: true, env: 'PBI_DB_PASSWORD' }),

    createIfMissing: Flags.boolean({ description: 'Create pbi workspace if missing', required: false, default: true, allowNo: true }),

    adminEmail: Flags.string({ description: 'Admninistrator email, to allow access from PBI dashboard', required: false, env: 'PBI_ADMIN_EMAIL' }),

    jsonOutput: Flags.boolean({ description: 'Verbose', required: false, default: false }),

    verbose: Flags.boolean({ description: 'Verbose', required: false, default: false }),

  }

  static PBI_CLI_PATH: string = require.resolve('@powerbi-cli/powerbi-cli');

  private verbose: boolean = false;

  private jsonOutput: boolean = false;

  private executePbiCliCommand(command: string): any {
    const pbiCliCommand = `${Upload.PBI_CLI_PATH} ${command}`;
    if (this.verbose) {
      shell.set('-v');
    }
    shell.set('-e');
    const result = shell.exec(pbiCliCommand, {
      silent: !this.verbose,
      fatal: true
    });
    return result
  }

  private pbiLogin(principal: string, secret: string, tenant: string): void {
    const command = `login --service-principal --verbose -p ${principal} -s ${secret} -t ${tenant}`;
    this.executePbiCliCommand(command);
  }

  private getWorkspaces(): any {
    const command = `workspace list`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private createWorkspace(name: string): any {
    const command = `workspace create -w ${name}`;
    const { stdout } = this.executePbiCliCommand(command);
    const workspaceResult = JSON.parse(stdout);
    if (workspaceResult.error) {
      throw new Error(workspaceResult.error.code);
    }
    return workspaceResult;
  }

  private grantAdminOwnershipOnWorkspace(workspaceId: string, adminEmail: string): any {
    const command = `workspace user add -w ${workspaceId} --email ${adminEmail} --access-right Admin --principal-type User`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private importReport(workspaceId: string, reportPath: string): any {
    const command = `import pbix -w ${workspaceId} --file ${reportPath} --conflict CreateOrOverwrite`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private getSingleReport(workspaceId: string, reportName: string): any {
    const command = `report show -w ${workspaceId} -r ${reportName}`;
    const { stdout } = this.executePbiCliCommand(command);
    const reportResult = JSON.parse(stdout);
    return reportResult;
  }

  private updateDatasetTenantParameters(workspaceId: string, datasetId: string, tenantId: string, tenantSchema: string): any {
    const tenantParamPayload = {
      updateDetails: [
        {
          name: 'tenant_schema',
          newValue: tenantSchema
        },
        {
          name: 'tenant_id',
          newValue: tenantId
        },
      ]
    };
    const command = `dataset parameter update -w ${workspaceId} -d ${datasetId} --parameter '${JSON.stringify(tenantParamPayload)}'`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private getDatasetGatewayDatasource(workspaceId: string, datasetId: string): any {
    const command = `dataset gateway datasource -w ${workspaceId} -d ${datasetId}`;
    const { stdout } = this.executePbiCliCommand(command);
    const datasetGatewayResult = JSON.parse(stdout);
    return datasetGatewayResult;
  }

  private updateDatasetDatasource(
    workspaceId: string, datasetId: string,
    existingDatasourceType: string, existingServer: string, existingDatabase: string,
    newServer: string, newDatabase: string): any {
    const updateDatasetDatasourcePayload = {
      updateDetails: [
        {
          datasourceSelector: {
            datasourceType: existingDatasourceType,
            connectionDetails: {
              server: existingServer,
              database: existingDatabase
            }
          },
          connectionDetails: {
            server: newServer,
            database: newDatabase
          }
        }
      ]
    };
    const command = `dataset datasource update -w ${workspaceId} -d ${datasetId} --update-details '${JSON.stringify(updateDatasetDatasourcePayload)}'`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private updateDatasourceCredentials(gatewayId: string, datasourceId: string, dbUsername: string, dbPassword: string) {
    const updateDatasourceCredentialsPayload = {

      credentialDetails: {
        credentialType: 'Basic',
        credentials: `{\"credentialData\":[{\"name\":\"username\", \"value\":\"${dbUsername}\"},{\"name\":\"password\", \"value\":\"${dbPassword}\"}]}`,
        encryptedConnection: 'Encrypted',
        encryptionAlgorithm: 'None',
        privacyLevel: 'None',
        useEndUserOAuth2Credentials: 'False'
      }

    };
    const command = `gateway datasource update -g ${gatewayId} -d ${datasourceId} --credential '${JSON.stringify(updateDatasourceCredentialsPayload)}'`;
    const { stdout } = this.executePbiCliCommand(command);
    return stdout;
  }

  private getWorkspaceName(tenantName: string, env: string) {
    return `${tenantName}-${env}`;
  }

  private findWorkspaceByName(name: string): any {
    const workspacesResult = this.getWorkspaces();
    const workspaces = JSON.parse(workspacesResult);
    return workspaces.find((workspace: any) => workspace.name.toUpperCase() == name.toUpperCase());
  }

  jsonEnabled(): boolean {
    return this.jsonOutput;
  }

  async run(): Promise<{ tenantId: string, reportId: string, workspaceId: string }> {

    const { flags } = await this.parse(Upload)
    const {
      reportPath, reportName,
      adPrincipal,
      adSecret,
      adTenantId,
      tenantName,
      env,
      createIfMissing,
      adminEmail,
      dbTenantSchema,
      dbTenantId,
      dbServer,
      dbName,
      dbUsername,
      dbPassword,
      jsonOutput,
      verbose,
    } = flags;

    this.jsonOutput = jsonOutput;
    this.verbose = verbose;

    this.pbiLogin(adPrincipal, adSecret, adTenantId);
    const workspaceName = this.getWorkspaceName(tenantName, env);
    let workspace = this.findWorkspaceByName(workspaceName)
    if (!workspace) {
      if (!createIfMissing) {
        throw new Error(`Workspace ${workspaceName} not found!`)
      } else if (!adminEmail) {
        throw new Error(`adminEmail flag required to create new workspace`)
      }
      workspace = this.createWorkspace(workspaceName);
      this.grantAdminOwnershipOnWorkspace(workspace.id, adminEmail);
    }
    const { id: workspaceId } = workspace;
    this.importReport(workspaceId, reportPath);
    const { datasetId, id: reportId } = this.getSingleReport(workspaceId, reportName);
    this.updateDatasetTenantParameters(workspaceId, datasetId, dbTenantId, dbTenantSchema);
    const [gatewayDatasource] = this.getDatasetGatewayDatasource(workspaceId, datasetId);
    const { gatewayId, id: dataSourceId, datasourceType, connectionDetails: dataSourceConnectionDetails } = gatewayDatasource;
    const { server: existingServer, database: existingDatabase } = JSON.parse(dataSourceConnectionDetails);
    this.updateDatasetDatasource(
      workspaceId, datasetId, datasourceType, existingServer, existingDatabase,
      dbServer, dbName
    );
    this.updateDatasourceCredentials(gatewayId, dataSourceId, dbUsername, dbPassword);

    return {
      tenantId: dbTenantId,
      reportId,
      workspaceId
    }
  }
}
