import * as dotenv from 'dotenv';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { SearchIndexClient, AzureKeyCredential } from '@azure/search-documents';
import { stimulusIndex } from 'src/search/indexConfigurations/stimulusIndex';
import { stimulusLocationsIndex } from 'src/search/indexConfigurations/stimulusLocationsIndex';

export class BusinessNamesPropertyINdex1693577014240 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    dotenv.config();
    const EstimulusSearchEndpoint = `https://${process.env['GLOBAL-SEARCH-SERVICE-NAME']}.search.windows.net`;
    const EstimulusSearchKey = process.env['GLOBAL-SEARCH-SERVICE-KEY'];
    const indexClient = new SearchIndexClient(EstimulusSearchEndpoint, new AzureKeyCredential(EstimulusSearchKey));

    const indexListName = process.env['GLOBAL-SEARCH-SERVICE-COMPANY-AGGREGATE-INDEX-NAME'];
    await indexClient.deleteIndex(indexListName);
    await indexClient.createIndex({ ...stimulusIndex, name: indexListName } as any);

    // FIXME: don't reset or run Indexer on Production deployment to avoid timeout. It worked fine in lower environments.
    // const indexerClient = new SearchIndexerClient(EstimulusSearchEndpoint, new AzureKeyCredential(EstimulusSearchKey));
    // const indexerListName = process.env['GLOBAL-SEARCH-SERVICE-COMPANY-AGGREGATE-INDEXER-NAME'];
    // await indexerClient.resetIndexer(indexerListName);
    // await indexerClient.runIndexer(indexerListName);

    const indexLocationName = process.env['GLOBAL-SEARCH-SERVICE-COMPANY-LOCATION-AGGREGATE-INDEX-NAME'];
    await indexClient.deleteIndex(indexLocationName);
    await indexClient.createIndex({ ...stimulusLocationsIndex, name: indexLocationName } as any);

    // FIXME: don't reset or run Indexer on Production deployment to avoid timeout. It worked fine in lower environments.
    // const indexerLocationName = process.env['GLOBAL-SEARCH-SERVICE-COMPANY-LOCATION-AGGREGATE-INDEXER-NAME'];
    // await indexerClient.resetIndexer(indexerLocationName);
    // await indexerClient.runIndexer(indexerLocationName);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // do nothing for now
  }
}
