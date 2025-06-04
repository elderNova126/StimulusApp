const readLineSync = require('readline-sync');
const sql = require('mssql');
let connection = null;
const { schemas, tenantTables, configDb } = require('./constants');
try {
  sql
    .connect(configDb)
    .then(async function (connect) {
      console.log('Connected to SQL Server');
      connection = connect;
      let option = null;
      let confirm = null;

      schemas.forEach(async function (schema, index) {
        console.log(index + `- Schema ` + schema.name);
      });
      console.log('#############################################################');
      option = readLineSync.question('Select schema: ');
      //confirm
      let schema = schemas[option];
      console.log('#############################################################');
      confirm = readLineSync.question(
        `Are you sure you want to delete ${schema.name.toUpperCase()} tenant data? (y/n) `
      );
      if (confirm === 'y') {
        if (option) {
          const schemaToDelete = schemas[option];
          await deleteTenantData(schemaToDelete);
          await deleteGlobalInformation(schemaToDelete.name);
        } else {
          process.exit(1);
        }
      } else {
        process.exit(1);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
} catch (err) {
  //  error checks
}

async function deleteTenantData(schema) {
  tenantTables.forEach(async function (table) {
    let query = 'DELETE FROM[stimulus-data].[' + schema.shemaName + '].' + table;
    let result = await connection.query(query);
    console.log(`${table}: `, result.rowsAffected);
    return;
  });
}
async function deleteGlobalInformation(tenantName) {
  let tenant = await getTenantByName(tenantName);
  let companies = await getCompaniesByTenant(tenant.id);
  let companiesIds = companies.recordset.map((item) => `'${item.id}'`).join(',');
  try {
    let deleteLocations = 'DELETE FROM[stimulus-data].[global].location WHERE companyId IN (' + companiesIds + ')';
    const resultLocations = await connection.query(deleteLocations);
    console.log('Delete locations: ' + resultLocations.rowsAffected);

    let deleteContacts = 'DELETE FROM[stimulus-data].[global].contact WHERE companyId IN (' + companiesIds + ')';
    const resultContacts = await connection.query(deleteContacts);
    console.log('Delete Contacts: ' + resultContacts.rowsAffected);

    let deleteDataPoint = 'DELETE FROM[stimulus-data].[global].data_point WHERE companyId IN (' + companiesIds + ')';
    const resultDataPoint = await connection.query(deleteDataPoint);
    console.log('Delete data point: ' + resultDataPoint.rowsAffected);

    let deleteTenantCompanyRelationShip =
      'DELETE FROM[stimulus-data].[global].tenant_company_relationship WHERE companyId IN (' + companiesIds + ')';
    const resultTenantCompanyRelationShip = await connection.query(deleteTenantCompanyRelationShip);
    console.log('Delete TenantCompanyRelationShip: ' + resultTenantCompanyRelationShip.rowsAffected);

    let deleteCompany = 'DELETE FROM[stimulus-data].[global].company WHERE id IN (' + companiesIds + ')';
    const resultCompany = await connection.query(deleteCompany);
    console.log('Delete company: ' + resultCompany.rowsAffected);
  } catch (err) {
    console.log('ERROR:  ', JSON.stringify(err));
  }
  // let deleteTenantCompany = "DELETE FROM[stimulus-data].[global].tenant_company WHERE tenantId = IN (" + tenant.id + ")";
  // const resultTenantCompany = await connection.query(deleteTenantCompany);
  // console.log("Delete tenant company: " + resultTenantCompany.rowsAffected);

  // let deleteTenant = "DELETE FROM[stimulus-data].[global].tenant WHERE id = IN (" + tenant.id + ")";
  // const resultTenant = await connection.query(deleteTenant);
  // console.log("Delete tenant : " + resultTenant.rowsAffected);

  process.exit(1);
}

async function getTenantByName(name) {
  let query = "SELECT * FROM[stimulus-data].[global].tenant WHERE name = '" + name + "'";
  let result = await connection.query(query);
  return result.recordset[0];
}
async function getCompaniesByTenant(tenantId) {
  let query = "SELECT * FROM[stimulus-data].[global].tenant_company_relationship WHERE tenantId = '" + tenantId + "'";
  let result = await connection.query(query);

  let ids = result.recordset.map((tenantCompanyRelationship) => `'${tenantCompanyRelationship.companyId}'`).join(',');
  if (ids.length === 0) {
    console.log('No companies found');
    process.exit(1);
  }
  let queryCompanies = 'SELECT * FROM[stimulus-data].[global].company WHERE id IN (' + ids + ')';
  let companies = await connection.query(queryCompanies);
  return companies;
}
