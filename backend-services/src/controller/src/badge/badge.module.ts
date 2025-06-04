import { Module } from '@nestjs/common';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';

@Module({
  providers: [BadgeService],
  controllers: [BadgeController],
  exports: [BadgeService],
})
export class BadgeModule {}
