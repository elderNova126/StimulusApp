const sql = require('mssql');

const searchDuplicateTagsAndJoin = async () => {
  const { databaseName, server, password, port, user } = require('../config');
  try {
    sql
      .connect({
        server,
        database: databaseName,
        user,
        password: password,
        port: port
      })
      .then(async function (connect) {
        const tags = await connect.query('SELECT t.id, t.tag FROM [global].[tags] t');
        console.log(tags.recordset.length);

        const dicc = getMapDuplicatesByTag(tags.recordset);
        // console.log('map: ', map);

        // get value with more than one id
        const duplicates = new Map([...dicc.entries()].filter(({ 1: v }) => v.length > 1));

        console.log('duplicates: ', duplicates.size);
        try {
          // join tags
          for (const [key, value] of duplicates.entries()) {
            //   const ids = value.join(',');

            const query = `UPDATE [global].[company_tags_tags] SET tagsId = '${value[0].toString()}' WHERE tagsId IN (${value
              .map((id) => `'${id.toString()}'`)
              .join(',')})`;
            console.log('query: ', query);
            await connect.query(query);

            // delete tags duplicates
            const idsToDelete = value.filter((id) => id !== value[0]);
            const queryDelete = `DELETE FROM [global].[tags] WHERE id IN (${idsToDelete
              .map((id) => `'${id.toString()}'`)
              .join(',')})`;
            console.log('queryDelete: ', queryDelete);
            await connect.query(queryDelete);
          }
        } catch (error) {
          console.log('Error: ', error);
          console.log('Error inserting chunk: ', numberOfLoop);
          console.log('query: ', query);
          sql.close();
        }
      });
  } catch (error) {
    console.log('Connection Error: ', error);
    return false;
  }
};

// omit cappitan letters
const getMapDuplicatesByTag = (tags) => {
  const map = new Map();
  tags.forEach((tag) => {
    const tagLowerCase = tag.tag.toLowerCase();
    if (map.has(tagLowerCase)) {
      map.get(tagLowerCase).push(tag.id);
    } else {
      map.set(tagLowerCase, [tag.id]);
    }
  });
  return map;
};

searchDuplicateTagsAndJoin();
