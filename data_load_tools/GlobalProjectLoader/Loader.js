const sql = require("mssql");
const { constrictorGlobalProjectAndSuppliers, sliceRowsToInsert, schemas, filterSupplier, machSupplierWithProject, filterTheProject } = require('./entity');

const { configDb, configTenantDb } = require('../config');
// conect to your database
const poolGlobal = new sql.ConnectionPool(configDb);
const sqlRequest = new sql.Request(poolGlobal);

//Connect to tenant database
const poolTenant = new sql.ConnectionPool(configTenantDb);
const sqlRequestTenant = new sql.Request(poolTenant);


//Get Tenant Ids
const getTenantIds = async () => {
    const query = `SELECT * FROM [global].[tenant] WHERE [provisionStatus] = 'provisioned'`;
    const result = await sqlRequest.query(query);
    return result.recordset;
}

//Get all project from tenant database
const getSuppliersFromTenant = async (projects) => {
    let result = null
    if (!projects) {
        const query = `SELECT [companyId],[projectId]  FROM [${configTenantDb.user}].[project_company] WHERE [type] = 'AWARDED' `;
        result = await sqlRequestTenant.query(query);
    } else {
        const query = `SELECT [companyId],[projectId] FROM [${configTenantDb.user}].[project_company] WHERE [type] = 'AWARDED' AND [projectId] IN (${projects.map(project => project.id).join(',')})`;
        result = await sqlRequestTenant.query(query);
    }
    return result.recordset;
}

//Get all supplier from global database
const getSuppliersFromGlobal = async () => {
    const query = `SELECT * FROM [global].[project_suppliers] `;
    const result = await sqlRequest.query(query);
    return result.recordset;
}

//Get all project from tenant database
const getProjectsFromGlobal = async () => {
    const query = `SELECT [id],[projectId], [entityType], [entityId] FROM [global].[project_tree] `;
    const result = await sqlRequest.query(query);
    return result.recordset;
}
//Get all project from tenant database
const getProjectsFromTenants = async () => {
    const query = `SELECT * FROM [${configTenantDb.user}].[project] WHERE [status] = 'COMPLETED'`;
    const result = await sqlRequestTenant.query(query);
    return result.recordset;
}

/* const insertToGlobalProject = async (projects) => {
    const proejectWithSlice = sliceRowsToInsert(projects);
    proejectWithSlice.forEach(async (project, indexFor) => {
        const query = `INSERT INTO [global].[project_tree] (projectId, entityType, entityId, mpath) VALUES
        ${project.map((project, i) => `('${project.projectId}', 'TENANT', '${project.entityId}', '1')`).join(',')}
        `;
        const insert = await sqlRequest.query(query);
        return insert
    });
} */

const insertToGlobalProject = async (projects) => {
    const proejectWithSlice = sliceRowsToInsert(projects);
    proejectWithSlice.forEach(async (project, indexFor) => {
        const query = `INSERT INTO [global].[project_tree] (projectId, entityType, entityId) VALUES
        ${project.map((project, i) => `('${project.projectId}', 'TENANT', '${project.entityId}')`).join(',')}
        `;
        const insert = await sqlRequest.query(query);
        return insert
    });
}

const updateMpath = async (projects) => {
    const proejectWithSlice = sliceRowsToInsert(projects);
    proejectWithSlice.forEach(async (project, indexFor) => {
        const updateQuery = project.map((project) => `UPDATE [global].[project_tree] SET mpath = '${project.id}' WHERE id = ${project.id}`).join(';');
        const update = await sqlRequest.query(updateQuery);
        return update;
    });
}

const insertToGlobalSupplier = async (suppliers) => {
    const suppliersWithSlice = sliceRowsToInsert(suppliers, 600);
    suppliersWithSlice.forEach(async (supplier) => {
        const query = `INSERT INTO [global].[project_suppliers] (companyId, globalprojectId) VALUES
        ${supplier.map(supplier => `('${supplier.companyId}', '${supplier.projectId}')`).join(',')}
        `;
        return await sqlRequest.query(query);
    });
}

const loadProjectTree = async () => {
    try {

        try {
            await poolGlobal.connect();
            await poolTenant.connect();
        } catch (error) {
            throw new Error(error);
        }

        const globalProjects = await getProjectsFromGlobal();
        console.log("Total globalProjects", globalProjects.length);
        const TenatnProject = await getProjectsFromTenants();
        console.log("Total TenatnProject", TenatnProject.length);
        const Projects = await filterTheProject(TenatnProject, globalProjects);
        console.log("Total Projects after parse", Projects.length);
        const tenant = await getTenantIds();
        console.log("Total tenant", tenant.length);
        const currentTenant = tenant.filter(tenant => tenant.name === schemas[0].name)[0];
        console.log("currentTenant", currentTenant);
        const [projectToInsert] = await constrictorGlobalProjectAndSuppliers(Projects, currentTenant.id);

        const insert = await insertToGlobalProject(projectToInsert);


        console.log("Imported successfully");
        return insert;
    }
    catch (err) {
        console.log(err);
    }
}

const fixMpath = async () => {
    try {
        try {
            await poolGlobal.connect();
            await poolTenant.connect();
        } catch (error) {
            throw new Error(error);
        }

        const projectTree = await getProjectsFromGlobal();
        console.log("Total projectTree", projectTree.length);
        const update = await updateMpath(projectTree);
        return update;
    } catch (err) {
        console.log(err);
    }
}


const loadSuppliers = async () => {
    try {

        try {
            await poolGlobal.connect();
            await poolTenant.connect();
        } catch (error) {
            throw new Error(error);
        }

        const suppliers = await getSuppliersFromTenant();
        console.log("Total suppliers", suppliers.length);
        const projectTree = await getProjectsFromGlobal();
        console.log("Total projectTree", projectTree.length);
        const supplierWithProjectTree = await machSupplierWithProject(projectTree, suppliers);

        console.log("Total supplierWithProjectTree", supplierWithProjectTree.length)
        await insertToGlobalSupplier(supplierWithProjectTree);
        console.log("Imported successfully");
        return true;
    }
    catch (err) {
        console.log(err);
    }
}


const mian = async () => {
    await loadProjectTree();
    await fixMpath();
    await loadSuppliers();
}

//loadProjectTree();
//fixMpath();
//loadSuppliers();
//mian()