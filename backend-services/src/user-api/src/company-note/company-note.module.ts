import { Module } from '@nestjs/common';
import { CompanyNoteResolver } from './company-note.resolver';
import { CompanyNoteService } from './company-note.service';

@Module({
  providers: [CompanyNoteResolver, CompanyNoteService],
})
export class CompanyNoteModule {}
