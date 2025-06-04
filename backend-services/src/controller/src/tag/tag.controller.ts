import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @GrpcMethod('DataService', 'GetDistinctTags')
  async getDistinctTags(_data: any): Promise<{ values: any[] }> {
    return this.tagService.getDistinctTags();
  }

  @GrpcMethod('DataService', 'FilterCompanyTag')
  async filterCompanyTag(data: any): Promise<{ values: any[] }> {
    return this.tagService.filterCompanyTag(data.tag);
  }
}
