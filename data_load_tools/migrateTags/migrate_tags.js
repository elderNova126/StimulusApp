const sql = require('mssql');
const { configDb } = require('../config');
const { getCompaniesTags } = require('./migrate_company_tags');
const fs = require('fs');


const groupTags = async (companies) => {
  const tagsWithundefined = companies.map(company => company.tags.split(','));
  const arrayOfArraysTags = tagsWithundefined.map(tag => tag.map(t => t.trim()));
  const tags = arrayOfArraysTags.flat();
  const uniqueTags = [...new Set(tags)];
  // repalce "'" with "''" to avoid sql error
  const tagsWithoutApostrophe = uniqueTags.map(tag => tag.replace(/'/g, "''"));
  console.log('Total tags found: ', tagsWithoutApostrophe.length);
  return tagsWithoutApostrophe;
};

const insertTags = async (db,tags) => {
  const chuckSize = 1000;
  const chucks = [];
  let index = 0;
  let numberOfLoop = 1
  let query = '';
  while (index < tags.length) {
    chucks.push(tags.slice(index, index + chuckSize));
    index += chuckSize;
  }

  for (const chunk of chucks) {
    const values = chunk.map((item) => {
      return `('${item}')`;
    });
    try {
      query = `INSERT INTO [global].[tags] (tag) VALUES ${values.join(',')}`;
      console.log('Inserting chunk: ', numberOfLoop);
      numberOfLoop++;
     await db.query(query); 
    } catch (error) {
      console.log('Error: ', error);
      console.log('Error inserting chunk: ', numberOfLoop);
      console.log('query: ', query);
      sql.close();
      break;
    }
  }
};




const main = async () => {
  try {
    let db = null;
    try {
       db =  await sql.connect(configDb);
    } catch (error) {
      console.log('Connection Error: ', error);
      return false;
    }
    const companies = await getCompaniesTags(db);
    tags = await groupTags(companies);
    await insertTags(db,tags);
    sql.close();
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}

const checkConnection = async (db) => {
  console.log('Checking connection');
  try {
    try {
        db =  await sql.connect(configDb);
    } catch (error) {
      console.log('Connection Error: ', error);
      return false;
    }
    console.log('Connection successfull');
    sql.close();
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}

const selectAndEditTagsWithStrangeCharacters = async () => {
  try {
  let db = null;
   try {
      db =  await sql.connect(configDb);
      console.log('Connection successfull');
  } catch (error) {
    console.log('Connection Error: ', error);
    return false;
  } 
  const tagsToFixData = fs.readFileSync('./tagsToFixData.csv', 'utf8');
  const tagsIdsToFix = tagsToFixData.split(',');
  tagsIdsToFix.pop();

  const query = `SELECT [id], [tag] FROM [global].[tags] where id in (${tagsIdsToFix.map(id => `'${id}'`).join(',')})`;
  const response  =  await db.query(query);
  const tags = response.recordset;

  const tagsWithoutFirstCharacter = tags.map(tag => {
    const firstCharacter = tag.tag[0];
    const tagWithoutFirstCharacter = tag.tag.replace(firstCharacter, '').replace(/(¢)/g, '').replace(/'/g, "''").replace(/\(([^)]+)\)/, '').replace(/\(([.]+)\)/,'').replace(/_/g,'').trim();
    return {
      id: tag.id,
      tag: tagWithoutFirstCharacter
    }
  });
  for (const tag of tagsWithoutFirstCharacter) {
    if (tag.tag.length === 0) {
      tag.tag = 'empty-to-delete-by-script';
    }
    const queryUpdate = `UPDATE [global].[tags] SET [tag] = '${tag.tag}' WHERE [id] = '${tag.id}'`;
    console.log('queryUpdate: ', queryUpdate);
    try {
      const update = await db.query(queryUpdate);
      console.log('update: ', update);
    } catch (error) {
      console.log('Error: ', error);
      sql.close();
      break;
    }
  }
  } catch (error) {
  console.log('Error: ', error);
  sql.close();
}}


const deleteEntryTags = async () => {
  try {
    let db = null;
     try {
        db =  await sql.connect(configDb);
        console.log('Connection successfull');
    } catch (error) {
      console.log('Connection Error: ', error);
      return false;
    } 

  const selectTagsToDelete = `SELECT [id], [tag] FROM [global].[tags] where tag = 'empty-to-delete-by-script'`;
  const responseSelectTagsToDelete  =  await db.query(selectTagsToDelete);
  const tagsToDelete = responseSelectTagsToDelete.recordset;
  console.log('tagsToDelete: ', tagsToDelete);

  const deleteQuery = `DELETE FROM [global].[company_tags_tags] where tagsId in (${tagsToDelete.map(tag => `'${tag.id}'`).join(',')})`;
  console.log('deleteQuery: ', deleteQuery);
  try {
    const deleteResponse = await db.query(deleteQuery);
    console.log('deleteResponse: ', deleteResponse);
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }

  const deleteTagsQuery = `DELETE FROM [global].[tags] where tag = 'empty-to-delete-by-script'`;
  console.log('deleteTagsQuery: ', deleteTagsQuery);
  try {
    const deleteTagsResponse = await db.query(deleteTagsQuery);
    console.log('deleteTagsResponse: ', deleteTagsResponse);
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}
/* SELECT [id]
  FROM [global].[tags]
   where tag LIKE '-%' or tag LIKE '!%' or tag LIKE ' %' 
   or tag LIKE '/%' or tag LIKE '[_]%' or tag LIKE '\%' or tag LIKE '"%' or tag like '#%' 
   or tag like '$%' or tag like '&%' or tag like '(%' or tag like '*%'
   or tag like '.%' or tag like ':%' or tag like '?%' or tag like '@%'
   or tag like '`%' or tag like '~%' or tag like '„%' or tag like '+%'
   or tag like '<%' or tag like '>%' or tag like '=%' or tag like '¢%'
   or tag like ';%' or tag ='' or tag like ')%' or  tag like '''%'
 */
   selectAndEditTagsWithStrangeCharacters();
 // checkConnection();
 // main();
