import { Module } from '@nestjs/common';
import { SharedListResolver } from './shared-list.resolver';
import { SharedListService } from './shared-list.service';

@Module({
  providers: [SharedListResolver, SharedListService],
})
export class SharedListModule {}
