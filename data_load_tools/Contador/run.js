const sql = require('mssql');
const { configDb } = require('../config');
const sqlExecute = async (configDb, query) => {
  let conn = await sql.connect(configDb);

  let res = await sql.query(query);

  await conn.close();

  return res;
};

const executeQuery = async (acction, query) => {
  try {
    let dbResponse = await sqlExecute(configDb, query);
    return dbResponse;
  } catch (error) {
    console.log('error executeQuery ' + acction + ' error:', error);
    throw error;
  }
};

const TenantsData = async () => {
  let index = 0;
  let info = {
    totalTenas: 0,
    tenants: []
  };

  let selectAllTenast = `select [name],[id]
    from [global].tenant`;

  let responseAllTenast = await executeQuery('SELECT', selectAllTenast);
  let AllTenast = responseAllTenast.recordset;
  //console.log("responseAllTenast", responseAllTenast.recordset);

  info.totalTenas = AllTenast.length;
  console.table(AllTenast);
  for (let tenant of AllTenast) {
    //relation
    let countRelationShipQuery = `select count(*) as cont
    from [global].tenant_company_relationship t
    left join [global].company c on t.companyId = c.id
    where tenantId = '${tenant.id}'`;

    let RelationShip = await executeQuery('SELECT', countRelationShipQuery);

    //contact
    let countContactQuery = `select count(*) as cont
    from [global].contact t
    left join [global].company c on t.companyId = c.id
    where companyId = '${tenant.id}'`;

    let responsecountContact = await executeQuery('SELECT', countContactQuery);

    //location
    let countLocationQuery = `select count(*) as cont
    from [global].location t
    left join [global].company c on t.companyId = c.id
    where companyId = '${tenant.id}'`;

    let responsecountLocations = await executeQuery('SELECT', countLocationQuery);

    //datapionts
    let countdatapointQuery = `select count(*) as cont
    from [global].data_point t
    left join [global].company c on t.companyId = c.id
    where companyId = '${tenant.id}'`;

    let responsedatapoint = await executeQuery('SELECT', countdatapointQuery);

    //project
    let responseproject;
    try {
      let countprojectQuery = `select count(*) as cont
        from [${tenant.name.toLowerCase().replace(/ /g, '_')}].project`;

      const res = await executeQuery('SELECT', countprojectQuery);
      responseproject = res;
    } catch (error) {
      responseproject = false;
    }

    //company
    let countcompanyQuery = `select count(*) as cont
        from [global].tenant_company_relationship where tenantid = '${tenant.id}'`;

    let responsecountcompany = await executeQuery('SELECT', countcompanyQuery);

    let infotenant = {
      name: tenant.name.toLowerCase().replace(/ /g, '_'),
      relationShip: RelationShip.recordset[0].cont,
      contact: responsecountContact.recordset[0].cont,
      locations: responsecountLocations.recordset[0].cont,
      datapoint: responsedatapoint.recordset[0].cont,
      project:
        responseproject !== false
          ? responseproject.recordset[0].cont
          : `Check status of tenant ${tenant.name.toLowerCase().replace(/ /g, '_') + '.project'}`,
      company: responsecountcompany.recordset[0].cont
    };
    console.log('infotenant', infotenant);
    info.tenants.push(infotenant);
    index++;

    console.log(`tenant ${index} de ${info.totalTenas}`);
  }
  console.table('all Tenants :', info.tenants);
  process.exit(0);
};

TenantsData();
