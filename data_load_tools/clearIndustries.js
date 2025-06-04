var sql = require('mssql');
let connection = null;
const { configDb } = require('./config');
try {
  sql
    .connect(configDb)
    .then(async function (connect) {
      const industries = await connect.query('SELECT * FROM[stimulus-data].[global].industry WHERE code IS NULL');
      const arr = industries.recordset.map((item) => item);
      const industriesUnique = [];
      const industriesTodelete = 0;
      arr.map((item) => {
        let industry = industriesUnique.filter((item2) => item2.title === item.title);
        if (industry.length === 0) {
          industriesUnique.push(item);
        }
      });
      for (const uniqueIndustry of industriesUnique) {
        const duplicates = arr.filter((item) => item.title === uniqueIndustry.title && item.id !== uniqueIndustry.id);
        // duplicates.forEach(async (industryDuplicate) => {
        let ids = duplicates.map((industry) => `'${industry.id}'`).join(',');
        const duplicateRelation = await connect.query(
          'SELECT * FROM[stimulus-data].[global].company_industries_industry WHERE industryId IN (' + ids + ')'
        );

        for (const industryDuplicate of duplicateRelation) {
          try {
            // const duplicateRelation = await connect.query("SELECT * FROM[stimulus-data].[global].company_industries_industry WHERE industryId = '" + industryDuplicate.id + "'");
            if (duplicateRelation.recordset.length > 0) {
              for (const item of duplicateRelation.recordset) {
                try {
                  let update = await connect.query(
                    "UPDATE [stimulus-data].[global].company_industries_industry SET industryId = '" +
                      uniqueIndustry.id +
                      "' WHERE industryId = '" +
                      item.industryId +
                      "'"
                  );
                  console.log(update.rowsAffected);
                } catch (error) {
                  console.log('Update: ', error);
                }
              }
            }
            industriesTodelete++;
            if (industriesTodelete.length % 100 === 0) {
              console.log(industriesTodelete.length);
            }
          } catch (error) {
            console.log('20', error);
          }
        }

        const deleteIndustry = await connect.query(
          'DELETE FROM[stimulus-data].[global].industry WHERE id IN (' + ids + ')'
        );
        console.log('Delete industries: ', deleteIndustry.rowsAffected);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
} catch (err) {
  console.log(err);
  //  error checks
}
