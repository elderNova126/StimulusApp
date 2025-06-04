import { Module } from '@nestjs/common';
import { DataPointService } from './data-point.service';
import { DataPointController } from './data-point.controller';
import { DataPointStreamService } from './data-point-stream.service';
import { DataPointStreamController } from './data-point-stream.controller';
import { ScoreLogicModule } from '../score-logic/score-logic.module';
import { IndustryModule } from 'src/industry/industry.module';
import { UploadReportModule } from 'src/upload-report/upload-report.module';
import { DataTraceMetaModule } from 'src/shared/data-trace-meta/data-trace-meta.module';
import { TagModule } from 'src/tag/tag.module';
import { DiverseOwnershipModule } from 'src/diverse-ownership/diverse-ownership.module';
import { MinorityOwnershipDetailModule } from 'src/minority-ownershipDetail/minority-ownershipDetail.module';
import { CompanyNamesService } from 'src/company-names/company-names.service';

@Module({
  imports: [
    ScoreLogicModule,
    IndustryModule,
    UploadReportModule,
    DataTraceMetaModule,
    TagModule,
    DiverseOwnershipModule,
    MinorityOwnershipDetailModule,
  ],
  providers: [DataPointService, DataPointStreamService, CompanyNamesService],
  controllers: [DataPointController, DataPointStreamController],
})
export class DataPointModule {}
