import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { controller } from 'controller-proto/codegen/tenant_pb';

@Injectable()
export class CacheRedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getDiscoverCompanyByCache(
    tenantId: string,
    queryRes: controller.QueryRequestPayload,
    indexName: string
  ): Promise<any> {
    const { pagination } = queryRes;
    const { limit, page } = pagination;
    return this.cacheManager.get(`dis-${tenantId}-${limit}-${page}-${indexName}`);
  }

  async setDiscoverCompanyByCache(
    tenantId: string,
    value: any,
    queryRes: controller.QueryRequestPayload,
    indexName
  ): Promise<any> {
    const { pagination } = queryRes;
    const { limit, page } = pagination;
    return this.cacheManager.set(`dis-${tenantId}-${limit}-${page}-${indexName}`, value, { ttl: 40 });
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl: number): Promise<any> {
    return this.cacheManager.set(key, value, { ttl });
  }

  async del(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }
}
