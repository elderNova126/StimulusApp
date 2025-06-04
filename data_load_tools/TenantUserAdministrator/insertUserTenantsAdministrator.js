const sql = require('mssql');

function userTenantsAdministrator() {
  const { databaseName, host, password, port, username } = require('../config');
  try {
    sql
      .connect({
        server: host,
        database: databaseName,
        user: username,
        password: password,
        port: port
      })
      .then(async function (connect) {
        const tenants = await connect.query("SELECT * FROM [global].tenant WHERE provisionStatus = 'provisioned'");

        let userAdmin = await connect.query("SELECT * FROM [global].[user] WHERE email = 'admin@getStimulus.com'");

        if (userAdmin.rowsAffected[0] > 0) {
          console.log('Admin already exists');
          userAdmin = await connect.query("SELECT * FROM [global].[user] WHERE email = 'admin@getStimulus.com'");
        } else {
          await connect.query(
            "INSERT INTO [stimulus-data].[global].[user] (email, globalAdmin) VALUES('admin@getStimulus.com', 1)"
          );

          userAdmin = await connect.query("SELECT * FROM [global].[user] WHERE email = 'admin@getStimulus.com'");
        }

        console.log('Insert: ', userAdmin.rowsAffected);

        // create user tenant
        tenants.recordset.forEach(async (tenant) => {
          try {
            // if exist
            const userTenant = await connect.query(
              "SELECT * FROM [global].[user_tenant] WHERE userId = '" +
                userAdmin.recordset[0].id +
                "' AND tenantId = '" +
                tenant.id +
                "'"
            );
            if (userTenant.rowsAffected[0] > 0) {
              console.log('User tenant already exists');
              return;
            } else {
              // insert user tenant
              const insertUserTenant = await connect.query(
                "INSERT INTO [stimulus-data].[global].[user_tenant] (isDefault, approved, userId, tenantId) VALUES(1, 1, '" +
                  userAdmin.recordset[0].id +
                  "', '" +
                  tenant.id +
                  "')"
              );
              const userTenant = await connect.query(
                "SELECT * FROM [global].[user_tenant] WHERE userId = '" +
                  userAdmin.recordset[0].id +
                  "'" +
                  "AND tenantId = '" +
                  tenant.id +
                  "'"
              );
              console.log('Insert: ', insertUserTenant.rowsAffected);
              const admin = await getAdminRole(connect);

              // insert user_tenant_role
              const insertUserTenantRole = await connect.query(
                "INSERT INTO [stimulus-data].[global].[user_tenant_roles_role] (userTenantId, roleId) VALUES('" +
                  userTenant.recordset[0].id +
                  "'" +
                  ", '" +
                  admin.recordset[0].id +
                  "')"
              );
              console.log('Insert super admin role : ', insertUserTenantRole.rowsAffected);
            }
          } catch (error) {
            console.log('Insert: ', error);
          }
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    //  error checks
  }
}

async function getAdminRole(connection) {
  const adminRole = await connection.query("SELECT * FROM [global].[role] WHERE name = 'superadmin'");
  return adminRole;
}

function removeUserTenantsAdministrator() {
  const { databaseName, host, password, port, username } = require('../config');
  try {
    sql
      .connect({
        server: host,
        database: databaseName,
        user: username,
        password: password,
        port: port
      })
      .then(async function (connect) {
        const tenants = await connect.query("SELECT * FROM [global].tenant WHERE provisionStatus = 'provisioned'");

        let userAdmin = await connect.query("SELECT * FROM [global].[user] WHERE email = 'admin@getStimulus.com'");

        if (userAdmin.rowsAffected[0] > 0) {
          const userTenant = await connect.query(
            "SELECT * FROM [global].[user_tenant] WHERE userId = '" + userAdmin.recordset[0].id + "'"
          );

          // remove user tenant role
          userTenant.recordset.forEach(async (userTenant) => {
            const deleteUserTenantRole = await connect.query(
              "DELETE FROM [global].[user_tenant_roles_role] WHERE userTenantId = '" + userTenant.id + "'"
            );
            console.log('Delete user tenant role: ', deleteUserTenantRole.rowsAffected);

            await connect.query("DELETE FROM [global].[user_tenant] WHERE id = '" + userTenant.id + "'");
          });

          // remove user
          const deleteUser = await connect.query(
            "DELETE FROM [global].[user] WHERE id = '" + userAdmin.recordset[0].id + "'"
          );
          console.log('Delete user: ', deleteUser.rowsAffected);
        } else {
          console.log('Admin not exists');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    //  error checks
  }
}

//removeUserTenantsAdministrator();
userTenantsAdministrator();

// NOTAS
//select ut.*, u.email from global.user_tenant ut, [global].[user] u  where ut.userId = u.id and u.email = 'admin@getStimulus.com';
