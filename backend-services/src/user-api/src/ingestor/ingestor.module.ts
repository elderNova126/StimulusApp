import { Module } from '@nestjs/common';
import { IngestorController } from './ingestor.controller';
import { IngestorResolver } from './ingestor.resolver';
import { IngestorService } from './ingestor.service';

@Module({
  controllers: [IngestorController],
  providers: [IngestorResolver, IngestorService],
})
export class IngestorModule {}
