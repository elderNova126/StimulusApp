import { Module } from '@nestjs/common';
import { GlobalProjectService } from './project-tree.service';

@Module({
  providers: [GlobalProjectService],
  exports: [GlobalProjectService],
})
export class GlobalProjectModule {}
