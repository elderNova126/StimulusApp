import { forwardRef, Module } from '@nestjs/common';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';
import { CompanyListModule } from 'src/company-list/company-list.module';
import { CompanyListService } from 'src/company-list/company-list.service';
import { CompanyNoteModule } from 'src/company-note/company-note.module';
import { CompanyNoteService } from 'src/company-note/company-note.service';
import { DiverseOwnershipModule } from 'src/diverse-ownership/diverse-ownership.module';
import { MinorityOwnershipDetailModule } from 'src/minority-ownershipDetail/minority-ownershipDetail.module';
import { EvaluationModule } from 'src/evaluation/evaluation.module';
import { IndustryModule } from 'src/industry/industry.module';
import { ProjectModule } from 'src/project/project.module';
import { TagModule } from 'src/tag/tag.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { TenantService } from 'src/tenant/tenant.service';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { UserModule } from 'src/user/user.module';
import { EventModule } from '../event/event.module';
import { ScoreLogicModule } from '../score-logic/score-logic.module';
import { UploadReportModule } from './../upload-report/upload-report.module';
import { CompanyStreamController } from './company-stream.controller';
import { CompanyStreamService } from './company-stream.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { SEARCH_QUEUE } from '../search/search.constants';
import { BullModule } from '@nestjs/bull';
import { CompanyNamesService } from 'src/company-names/company-names.service';
@Module({
  imports: [
    EventModule,
    ScoreLogicModule,
    UploadReportModule,
    EvaluationModule,
    CacheForRedisModule,
    UserModule,
    IndustryModule,
    DiverseOwnershipModule,
    MinorityOwnershipDetailModule,
    TagModule,
    ProjectModule,
    UserProfileModule,
    forwardRef(() => TenantModule),
    forwardRef(() => CompanyListModule),
    CompanyNoteModule,
    BullModule.registerQueue({
      name: SEARCH_QUEUE,
    }),
  ],
  controllers: [CompanyController, CompanyStreamController],
  providers: [
    CompanyService,
    CompanyStreamService,
    CompanyListService,
    TenantService,
    CompanyNoteService,
    CompanyNamesService,
  ],
})
export class CompanyModule {}

// si tiene mas de un TCR en internal no lo borro -> solo borro la company pero dentro del tenant actual
