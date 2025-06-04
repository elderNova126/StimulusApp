const sql = require('mssql');
const { appendFileSync } = require('fs');

const { configDb } = require('../config');
try {
  sql
    .connect(configDb)
    .then(async function (connect) {
      //get all diverse ownership values
      const diverseOwnershipValues = await connect.query('SELECT * FROM [stimulus-data].[global].diverseOwnership');
      console.log('diverseOwnershipValues: ', diverseOwnershipValues.recordset);

      //get company by diverse ownership
      diverseOwnershipValues.recordset.map(async (value) => {
        try {
          const company = await connect.query(
            "SELECT c.id  FROM [stimulus-data].[global].company c WHERE diverseOwnership LIKE('%" +
              value.diverseOwnership +
              "%')"
          );

          company.recordset.map(async (data) => {
            appendFileSync('diverseOwnership_company.csv', `${data.id},${value.id} \n`);
          });

          // appendFileSync('tags_company.csv', `${data.companyId},${data.tag} \n`);
        } catch (error) {
          console.log('company: ', error);
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
