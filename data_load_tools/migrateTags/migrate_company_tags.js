const sql = require('mssql');
const { configDb } = require('../config');
const especialTag = 'Augusto kpo';

 const getAllTags = async (sql) => {
  const pageSize = 25000;
  const companyCount = await getTagsCount(sql);
  const tags = [];

  for (let i = 0; i < companyCount; i += pageSize) {
    const query = `SELECT [id]
    ,[tag]
    FROM [global].[tags]
    ORDER BY [id] ASC
    OFFSET ${i} ROWS
    FETCH NEXT ${pageSize} ROWS ONLY`;
    try {
      const tagsFromDb = await sql.query(query);
      tags.push(...tagsFromDb.recordset);
      console.log('current number of tags : ', tags.length);

    } catch (error) {
      console.log('Error: ', error);
      sql.close();
    }
  }
  return tags;
}
 const getCompaniesTags = async (sql) => {
  const pageSize = 25000;
  const companyCount = await getCompanyCount(sql);
  const companies = [];
  
  for (let i = 0; i < companyCount; i += pageSize) {
    const query = `SELECT 
    [id]
    ,[tags] 
    FROM [global].[company] 
    where tags is not null AND tags != '-'
    ORDER BY [id] ASC
    OFFSET ${i} ROWS
    FETCH NEXT ${pageSize} ROWS ONLY
    `;
    try {
      const companiesWithTags = await sql.query(query);
      companies.push(...companiesWithTags.recordset);
      console.log('current number of companies : ', companies.length);
    } catch (error) {
      console.log('Error: ', error);
      sql.close();
    }
  }
  return companies;
}



const getCompanyCount = async (sql) => {
  try {
    const companyCount = await sql.query("SELECT count(*) as count FROM [global].[company] where tags is not null AND tags != '-'");
    console.log('Total companies found: ', companyCount.recordset[0].count);
    return companyCount.recordset[0].count;
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}

const getTagsCount = async (sql) => {
  try {
    const tagsCount = await sql.query('SELECT count(*) as count FROM [global].[tags]');
    console.log('Total tags found: ', tagsCount.recordset[0].count);
    return tagsCount.recordset[0].count;
  } catch (error) {
    console.log('Error: ', error);
    sql.close();
  }
}


const companyTagsFactory = (companies, tags) => {
  const parseCompanyTags = [];
  const companyTags = companies.map((company) => {
    return {
      companyId: company.id,
      tagsId:company.tags.split(',').map((tag) => {
        const existentTag = tags.find((item) => item.tag.trim() === tag.trim());
        if (existentTag) {
          return existentTag.id;
        }
      }) 
    };
  });

  for (const company of companyTags) {
    company.tagsId = company.tagsId.filter((item) => item !== undefined);
    for (const tag of company.tagsId) {
      parseCompanyTags.push({
        companyId: company.companyId,
        tagsId: tag
      });
    }
  }
  return parseCompanyTags;
}

const insertCompanyTags = async (sql,companyTags) => {
  const chuckSize = 1000;
  const chucks = [];
  let index = 0;
  let numberOfLoop = 0
  while (index < companyTags.length) {
    chucks.push(companyTags.slice(index, index + chuckSize));
    index += chuckSize;
  }

  for (const chunk of chucks) {
    const values = chunk.map((item) => {
      return `('${item.companyId}', '${item.tagsId}')`;
    });
    const query = `INSERT INTO [global].[company_tags_tags] (companyId, tagsId) VALUES ${values.join(',')}`;
    console.log('Inserting chunk: ', numberOfLoop);
    numberOfLoop++;
    try {
      await sql.query(query);
    } catch (error) {
      console.log('Error: ', error);
      sql.close();
      break;
    }
  }
  return "All tags inserted";
}


const mainFunction = async () => {
  let db = null;
  try {
     db =  await sql.connect(configDb);
  } catch (error) {
    console.log('Connection Error: ', error);
    return false;
  }
  const tags = await getAllTags(db);
  console.log('Tags', tags.length);
  const companies = await getCompaniesTags(db);
  console.log('Companies', companies.length);
  const companyTags = companyTagsFactory(companies, tags);
  console.log('CompanyTags', companyTags.length);
  const response = await insertCompanyTags(db,companyTags);
  console.log(response,`all tags were imported. even the tag ${especialTag}.`);
  await sql.close();
  return true;
}


const getTagsRelation = async () => {
  try {
    const companiesTags = await sql.query('SELECT * FROM [global].[company_tags_tags]');
    return companiesTags.recordset;
  } catch (error) {
    console.log('Error: ', error);
  }
}



 // mainFunction();

// export all functions
module.exports = {
  getAllTags,
  getCompaniesTags,
  getCompanyCount,
  getTagsCount,
  companyTagsFactory,
  insertCompanyTags,
  mainFunction,
};