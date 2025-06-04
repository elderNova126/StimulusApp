const sql = require('mssql');

const diverseOwnershipValues = ['Minority', 'Women', 'Veteran', 'LGBTQ+', 'Disabled', 'Disadvantaged', 'Immigrant', 'Native American'];

const { configDb } = require('../config');
try {
  sql
    .connect(configDb)
    .then(async function (connect) {
      //insert all diverse ownership values
      diverseOwnershipValues.map(async (value) => {
        try {
          const object = {
            diverseOwnership: value
          };
          const insert = await connect.query(
            "INSERT INTO [stimulus-data].[global].diverseOwnership (diverseOwnership) VALUES ('" +
              object.diverseOwnership +
              "')"
          );
          console.log('Insert: ', insert.rowsAffected);
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
