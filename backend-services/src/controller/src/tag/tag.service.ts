import { Inject, Injectable } from '@nestjs/common';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { capitalizeFirstLetter } from 'src/utils/Strings';
import { In, Like, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { Tag, Tag as TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  private readonly tagRepository: Repository<TagEntity>;
  readonly searchFields = [];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger, // @InjectQueue(SEARCH_QUEUE) private searchQueue: Queue<StimulusJobData<any>>,
    private cacheRedisService: CacheRedisService
  ) {
    this.tagRepository = connection.getRepository(TagEntity);
  }

  async updateTags(tags: string[]) {
    if (tags.length === 1 && tags[0] === '') {
      return;
    }
    try {
      let tagsInDatabase = await this.tagRepository.find({
        where: {
          tag: In(tags),
        },
        select: ['id', 'tag'],
      });
      const tagsToAdd = tags.filter((tag) => !tagsInDatabase.map((tag) => tag.tag).includes(tag));
      if (tagsToAdd.length > 0) {
        // bulk insert
        const addedTags = await this.tagRepository.save(tagsToAdd.map((tag) => ({ tag })));
        tagsInDatabase = tagsInDatabase.concat(addedTags);
      }

      return tagsInDatabase;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getTagsByTagsName(tags: string[]): Promise<Tag[]> {
    if (tags.length === 1 && tags[0] === '') {
      return [];
    }
    try {
      const tagsFronDb = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.tag IN (:...tags)', { tags })
        .getMany();

      const filter = tagsFronDb
        .map((tag) => (tag.tag === tags.find((tagSelected) => tagSelected === tag.tag) ? tag : null))
        .filter((tag) => tag !== null);

      // remove duplicates tags in filter
      const uniqueTags = filter.filter((tag, index, self) => index === self.findIndex((t) => t.tag === tag.tag));

      return uniqueTags;
    } catch (error) {
      throw error;
    }
  }

  async getTagsByCompanyId(companyId: string): Promise<{ values: string[] }> {
    try {
      // filter if exist company arr
      const tagsInCache = await this.getTagsFromCache(`tags-${companyId}`);

      if (tagsInCache.values) {
        return {
          values: tagsInCache.values.map((tag) => capitalizeFirstLetter(tag)),
        };
      } else {
        const tags = await this.tagRepository
          .createQueryBuilder('tag')
          .leftJoinAndSelect('tag.company', 'company')
          .where('company.id = :companyId', { companyId })
          .getMany();

        const tagsValues = tags.map((tag) => capitalizeFirstLetter(tag.tag));

        await this.setTagsToCache(`tags-${companyId}`, tagsValues);

        return {
          values: tagsValues,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async getTagsObjsByCompanyId(companyId: string): Promise<Tag[]> {
    try {
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .leftJoinAndSelect('tag.company', 'company')
        .where('company.id = :companyId', { companyId })
        .getMany();

      return tags;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getTagsByTagNames(tags: string[]): Promise<{ values: Tag[] }> {
    try {
      const tagsInDatabase = await this.tagRepository.find({
        where: {
          tag: In(tags),
        },
      });

      return {
        values: tagsInDatabase,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // function to get all tags and limit to 50
  async getDistinctTags(): Promise<{ values: Tag[] }> {
    const tagsInCache = await this.getTagsFromCache(`top-50-tags`);

    if (tagsInCache.values) {
      return {
        values: tagsInCache.values.map((tag) => capitalizeFirstLetter(tag)),
      };
    } else {
      let tags = await this.tagRepository.find({
        order: {
          tag: 'ASC',
        },
        take: 50,
        skip: 0,
      });
      tags = tags.map((tag) => capitalizeFirstLetter(tag.tag));
      const tagsValues = tags.map((tag) => capitalizeFirstLetter(tag));

      await this.setTagsToCache(`top-50-tags`, tagsValues);
      const tagsOrdered = tags.sort().slice(0, 50);
      return {
        values: [...new Set(tagsOrdered)],
      };
    }
  }

  // filter tags by tag name
  async filterCompanyTag(tag: string): Promise<{ values: Tag[] }> {
    let tags = await this.tagRepository.find({
      order: {
        tag: 'ASC',
      },
      where: {
        tag: Like(`%${tag.toLowerCase()}%`),
      },
    });

    tags = tags.map((tag) => capitalizeFirstLetter(tag.tag));
    const tagsOrdered = tags.sort().slice(0, 50);
    return {
      values: [...new Set(tagsOrdered)],
    };
  }

  async getTagsFromCache(param: string): Promise<{ values: Tag[] }> {
    const tags = await this.cacheRedisService.get(param);
    return {
      values: tags,
    };
  }

  async setTagsToCache(param: string, tags: string[]): Promise<void> {
    await this.cacheRedisService.set(param, tags, 40);
  }
}
