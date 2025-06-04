import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { SavedSearch } from './saved-search.entity';

@Injectable()
export class SavedSearchService {
  private readonly savedSearchRepository: Repository<SavedSearch>;

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.savedSearchRepository = connection.getRepository(SavedSearch);
  }

  getSavedSearches(filters: SavedSearch): Promise<any[]> {
    const { userId, public: isPublic = true, ...restOfFilters } = filters;
    return this.savedSearchRepository.findAndCount({
      where: [
        { userId, ...restOfFilters },
        { public: isPublic, ...restOfFilters },
      ],
    });
  }

  async createSavedSearch(savedSearchData: SavedSearch): Promise<SavedSearch> {
    await this.nameSavedSearch(savedSearchData);

    return this.savedSearchRepository.save(savedSearchData);
  }

  private async nameSavedSearch(savedSearchData: SavedSearch) {
    const userId = savedSearchData.userId;
    const nameLikeExpression = Like(`${savedSearchData.name}%`);

    const whereStatement = { name: nameLikeExpression, public: savedSearchData.public, userId: null };
    if (!savedSearchData.public) {
      whereStatement.userId = userId;
    }

    const similarSearches = await this.savedSearchRepository.findAndCount({
      where: whereStatement,
    });

    let sufix = 0;
    let exit = false;
    let savedSearchName = savedSearchData.name;
    while (!exit && similarSearches[1] > 0) {
      savedSearchName = sufix > 0 ? `${savedSearchData.name} (${sufix})` : savedSearchName;
      exit = !similarSearches[0].some((x) => x.name === savedSearchName && x.id !== savedSearchData.id);
      sufix++;
    }

    savedSearchData.name = savedSearchName;
  }

  async updateSavedSearch(id: number, savedSearchData: SavedSearch): Promise<SavedSearch> {
    savedSearchData.id = id;
    await this.nameSavedSearch(savedSearchData);

    const savedSearch = await this.savedSearchRepository.findOneOrFail({ where: { id } });

    if (savedSearch.public || savedSearch.userId === savedSearchData.userId) {
      return this.savedSearchRepository.save({ ...savedSearchData, id });
    } else {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
  }

  async deleteSavedSearch(id: number, userId: string): Promise<DeleteResult> {
    const savedSearch = await this.savedSearchRepository.findOneOrFail({ where: { id } });
    if (savedSearch.userId === userId) {
      return this.savedSearchRepository.delete(id);
    } else {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
  }
}
