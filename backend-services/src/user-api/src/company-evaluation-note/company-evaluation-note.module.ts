import { Module } from '@nestjs/common';
import { CompanyEvaluationNoteResolver } from './company-evaluation-note.resolver';
import { CompanyEvaluationNoteService } from './company-evaluation-note.service';

@Module({
  providers: [CompanyEvaluationNoteResolver, CompanyEvaluationNoteService],
})
export class CompanyEvaluationNoteModule {}
