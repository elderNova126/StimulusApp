// script to handle the index
// usage: node handleIndex.js create|delete
// create: create the index
// delete: delete the index
//

const { SearchIndexClient, AzureKeyCredential, SearchIndexerClient } = require('@azure/search-documents');
const { azureCognitiveConfig } = require('../config');
const index = require('./stimulus-index');
const locationsIndex = require('./stimulus-locations-index');
const key = azureCognitiveConfig.key;
const endpoint = azureCognitiveConfig.endpoint;

const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(key));
const indexerClient = new SearchIndexerClient(endpoint, new AzureKeyCredential(key));

async function createIndex(index) {
  const newIndexResult = await indexClient.createIndex(index);
  console.log(`Create Index Result: ${JSON.stringify(newIndexResult)}`);
}

async function deleteIndex(name) {
  await indexClient.deleteIndex(name);
  console.log(` Delete current intace`);
}

async function getIndex(name) {
  const index = await indexClient.getIndex(name);
  console.log(`new intace create`);
}
async function restAndRunIndexer(indexName) {
  try {
    const indexerName = indexName.replace('-index', '-indexer');
    console.log(`Reset and run indexer "${indexerName}"`);
    await indexerClient.resetIndexer(indexerName);
    console.log(`Reset Indexer "${indexerName}"`);
    await indexerClient.runIndexer(indexerName);
    console.log(`Run Indexer "${indexerName}"`);
  } catch (error) {
    console.log(`Error rest or running indexer: ${error}`);
  }
}

// createIndex(index);
// deleteIndex(index.name);
// getIndex(index.name);
//restAndRunIndexer(index.name);

const resetIntanceOfIndex = async (index) => {
  await deleteIndex(index.name);
  await createIndex(index);
  await restAndRunIndexer(index.name);
};

resetIntanceOfIndex(index);
resetIntanceOfIndex(locationsIndex);

// qa index
