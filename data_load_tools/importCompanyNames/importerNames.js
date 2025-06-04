const sql = require('mssql');
const { configDb } = require('../config');

const migrateCompanyNames = async () => {
  const db = await initializeConnection();

  const previosNameResponse = await db.query(
    "INSERT INTO [global].[company_names] (name, type, companyId) SELECT [previousBusinessNames], 'PREVIOUS', [id] FROM [global].[company] WHERE [previousBusinessNames] IS NOT NULL AND [previousBusinessNames] != '-'"
  );
  console.log('previousNameResponse : ', previosNameResponse);
  const otherNameResponse = await db.query(
    "INSERT INTO [global].[company_names] (name, type, companyId) SELECT [otherBusinessNames], 'OTHER', [id] FROM [global].[company] WHERE [otherBusinessNames] IS NOT NULL AND [otherBusinessNames] != '-'"
  );
  console.log('otherNameResponse : ', otherNameResponse);
  sql.close();
};

const initializeConnection = async () => {
  let db = null;
  try {
    db = await sql.connect(configDb);
    return db;
  } catch (error) {
    console.log('Connection Error: ', error);
    return false;
  }
};

migrateCompanyNames();
