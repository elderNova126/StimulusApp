import { Injectable } from '@nestjs/common';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { SearchService } from 'azure-search-client';
import NodeCache from 'node-cache';
import { SearchIndexClient, AzureKeyCredential, SearchIndexerClient } from '@azure/search-documents';
import { stimulusIndex } from 'src/search/indexConfigurations/stimulusIndex';
import { stimulusLocationsIndex } from 'src/search/indexConfigurations/stimulusLocationsIndex';
@Injectable()
export class SearchClientProviderService {
  private readonly searchClientCache: NodeCache;
  private readonly defaultVersion = '2019-05-06';
  constructor(
    private readonly stimulusSecretClientService: StimulusSecretClientService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = SearchClientProviderService.name;
    this.searchClientCache = new NodeCache();
  }

  private getGlobalSearchServiceNameSecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-NAME`;
  }

  private getGlobalSearchServiceKeySecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-KEY`;
  }

  private async getProviderSecrests() {
    const globalServiceNameSecretName = this.getGlobalSearchServiceNameSecretName();
    const globalServiceKeySecretName = this.getGlobalSearchServiceKeySecretName();
    const globalServiceName = await this.getSecretFromCacheOrService(globalServiceNameSecretName);
    const globalServiceKey = await this.getSecretFromCacheOrService(globalServiceKeySecretName);
    return {
      name: globalServiceName,
      key: globalServiceKey,
    };
  }

  private async getSearchCompanyListInfo() {
    const indexCompanyListName = await this.getGlobalCompanyAggregateIndexName();
    const indexerCompanyListName = await this.getGlobalCompanyListAggregateIndexerName();
    return {
      Index: indexCompanyListName,
      indexer: indexerCompanyListName,
    };
  }

  private async getSearchCompanyLocationInfo() {
    const indexCompanyLocationName = await this.getGlobalCompanyLocationAggregateIndexName();
    const indexerCompanyLocationName = await this.getGlobalCompanyLocationAggregateIndexerName();
    return {
      Index: indexCompanyLocationName,
      indexer: indexerCompanyLocationName,
    };
  }
  private async getSecretFromCacheOrService(secretName: string): Promise<string> {
    let secretValue = this.searchClientCache.get<string>(secretName);

    if (secretValue === undefined) {
      const secret = await this.stimulusSecretClientService.getSecret(secretName);
      secretValue = secret.value;
      this.searchClientCache.set(secretName, secretValue, 86400);
    }
    return Promise.resolve(secretValue);
  }

  private getGlobalCompanyListAggregateIndexSecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-COMPANY-AGGREGATE-INDEX-NAME`;
  }
  private getGlobalCompanyAggregateIndexerListSecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-COMPANY-AGGREGATE-INDEXER-NAME`;
  }
  private getGlobalCompanyLocationAggregateIndexSecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-COMPANY-LOCATION-AGGREGATE-INDEX-NAME`;
  }
  private getGlobalCompanyAggregateIndexerLocaitonSecretName(): string {
    return `GLOBAL-SEARCH-SERVICE-COMPANY-LOCATION-AGGREGATE-INDEXER-NAME`;
  }

  public async getGlobalCompanyAggregateIndexName(): Promise<string> {
    const globalCompanyAggregateIndexSecretName = this.getGlobalCompanyListAggregateIndexSecretName();
    const globalCompanyAggregateIndex = await this.getSecretFromCacheOrService(globalCompanyAggregateIndexSecretName);
    return globalCompanyAggregateIndex;
  }

  public async getGlobalCompanyListAggregateIndexerName(): Promise<string> {
    const globalCompanyAggregateIndexerSecretName = this.getGlobalCompanyAggregateIndexerListSecretName();
    const globalCompanyAggregateIndexer = await this.getSecretFromCacheOrService(
      globalCompanyAggregateIndexerSecretName
    );
    return globalCompanyAggregateIndexer;
  }
  public async getGlobalCompanyLocationAggregateIndexName(): Promise<string> {
    const globalCompanyAggregateIndexSecretName = this.getGlobalCompanyLocationAggregateIndexSecretName();
    const globalCompanyAggregateIndex = await this.getSecretFromCacheOrService(globalCompanyAggregateIndexSecretName);
    return globalCompanyAggregateIndex;
  }
  public async getGlobalCompanyLocationAggregateIndexerName(): Promise<string> {
    const globalCompanyAggregateIndexerSecretName = this.getGlobalCompanyAggregateIndexerLocaitonSecretName();
    const globalCompanyAggregateIndexer = await this.getSecretFromCacheOrService(
      globalCompanyAggregateIndexerSecretName
    );
    return globalCompanyAggregateIndexer;
  }

  public async getGlobalSearchClient(): Promise<SearchService> {
    const { name, key } = await this.getProviderSecrests();
    return new SearchService(name, key, this.defaultVersion);
  }

  public async updateAndRunIndex(): Promise<void> {
    const { name, key } = await this.getProviderSecrests();
    const EstimulusSearchEndpoint = `https://${name}.search.windows.net`;
    const indexClient = new SearchIndexClient(EstimulusSearchEndpoint, new AzureKeyCredential(key));
    const indexerClient = new SearchIndexerClient(EstimulusSearchEndpoint, new AzureKeyCredential(key));

    const { Index, indexer } = await this.getSearchCompanyListInfo();
    await indexClient.deleteIndex(Index);
    await indexClient.createIndex({ ...stimulusIndex, name: Index } as any);
    await indexerClient.resetIndexer(indexer);
    await indexerClient.runIndexer(indexer);

    const { Index: IndexLocation, indexer: indexerLocation } = await this.getSearchCompanyLocationInfo();
    await indexClient.deleteIndex(IndexLocation);
    await indexClient.createIndex({ ...stimulusLocationsIndex, name: IndexLocation } as any);
    await indexerClient.resetIndexer(indexerLocation);
    await indexerClient.runIndexer(indexerLocation);
  }
}
