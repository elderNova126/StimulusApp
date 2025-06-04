import { Module } from '@nestjs/common';
import { CompanyNoteService } from './company-note.service';
import { CompanyNoteController } from './company-note.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [CompanyNoteService],
  imports: [UserModule],
  controllers: [CompanyNoteController],
})
export class CompanyNoteModule {}
