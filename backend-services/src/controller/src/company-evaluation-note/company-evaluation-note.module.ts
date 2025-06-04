import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CompanyEvaluationNoteService } from './company-evaluation-note.service';
import { CompanyEvaluationNoteController } from './company-evaluation-note.controller';

@Module({
  providers: [CompanyEvaluationNoteService],
  imports: [UserModule],
  controllers: [CompanyEvaluationNoteController],
})
export class CompanyEvaluationNoteModule {}
