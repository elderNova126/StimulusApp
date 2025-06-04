import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CompanyListService } from './company-list.service';
import { CompanyListController } from './company-list.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [UserModule, EventModule],
  providers: [CompanyListService],
  controllers: [CompanyListController],
})
export class CompanyListModule {}
