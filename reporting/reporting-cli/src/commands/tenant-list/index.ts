import 'dotenv/config'
import { Command, Flags } from '@oclif/core'
import * as sql from 'mssql'
import * as fs from 'fs/promises'
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

export default class TenantList extends Command {
  static description = 'List tenants'

  static examples = [
    `$ `,
  ]

  static flags = {
    jsonOutputPath: Flags.string({ description: 'Path to output json file', required: true, env: 'TENANT_JSON_OUTPUT_PATH' }),

    opDbConnectionString: Flags.string({ description: 'Operational Db connection string', required: true, env: 'OPERATIONAL_DB_CONNECTION_STRING' }),

    opDbGlobalSchema: Flags.string({ description: 'Global db schema', required: true, env: 'OPERATIONAL_GLOBAL_DB_SCHEMA' }),

    opDbTenantTable: Flags.string({ description: 'Tenant table name', required: true, env: 'OPERATIONAL_TENANT_TABLE' }),

    azKeyVaultUrl: Flags.string({ description: 'Azure Key Vault URL', required: true, env: 'AZURE_VAULT_URL' }),

    verbose: Flags.boolean({ description: 'Verbose', required: false, default: false }),

  }

  private verbose: boolean = false;

  private async getTenants(schema: string, table: string): Promise<sql.IResult<any>> {
    return await sql.query(`SELECT * FROM [${schema}].[${table}] WHERE provisionStatus = 'provisioned'`);
  }

  private getTenantDBNameSecretName(tenantId: string): string {
    return `${tenantId.toUpperCase()}-DB-NAME`;
  }

  private getTenantDBSchemaSecretName(tenantId: string): string {
    return `${tenantId.toUpperCase()}-DB-SCHEMA`;
  }

  private getTenantDBUserNameSecretName(tenantId: string): string {
    return `${tenantId.toUpperCase()}-DB-USERNAME`;
  }

  private getTenantDBUserPasswordSecretName(tenantId: string): string {
    return `${tenantId.toUpperCase()}-DB-PASSWORD`;
  }

  private async getTenantDbSecrets(secretClient: SecretClient, tenantId: string): Promise<any> {
    const { value: dbName } = await secretClient.getSecret(
      this.getTenantDBNameSecretName(tenantId),
    );
    const { value: dbSchema } = await secretClient.getSecret(
      this.getTenantDBSchemaSecretName(tenantId),
    );
    const { value: username } = await secretClient.getSecret(
      this.getTenantDBUserNameSecretName(tenantId),
    );
    const { value: password } = await secretClient.getSecret(
      this.getTenantDBUserPasswordSecretName(tenantId),
    );
    return {
      tenantId,
      dbName,
      dbSchema,
      username,
      password
    }
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TenantList)
    const {
      jsonOutputPath,
      opDbConnectionString,
      opDbGlobalSchema,
      opDbTenantTable,
      azKeyVaultUrl,
      verbose
    } = flags;

    const connection = await sql.connect(opDbConnectionString);
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(azKeyVaultUrl, credential);

    const { recordset: tenants } = await this.getTenants(opDbGlobalSchema, opDbTenantTable);
    const tenantMap = tenants.reduce((map, tenant) => {
      map.set(tenant.id, tenant);
      return map;
    }, new Map());

    const tenantDbSecretsPromises = new Array();
    for (const tenant of tenants) {
      const tenantDbSecretsPromise = this.getTenantDbSecrets(secretClient, tenant.id)
      tenantDbSecretsPromises.push(tenantDbSecretsPromise);
    }

    const tenantDbSecretsResults = await Promise.all(Array.from(tenantDbSecretsPromises.values()));

    const tenantsResult = new Array();
    for (const tenantDbSecrets of tenantDbSecretsResults) {
      let tenant = tenantMap.get(tenantDbSecrets.tenantId);
      delete tenantDbSecrets.tenantId;
      tenant = { ...tenant, ...tenantDbSecrets };
      tenantsResult.push(tenant)
    }

    const stringOutput = JSON.stringify(tenantsResult);
    if (jsonOutputPath) {
      await fs.writeFile(jsonOutputPath, stringOutput);
    } else {
      this.log(stringOutput)
    }
    await connection.close();
  }
}
