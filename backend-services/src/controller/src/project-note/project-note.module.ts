import { Module } from '@nestjs/common';
import { ProjectNoteService } from './project-note.service';
import { ProjectNoteController } from './project-note.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ProjectNoteService],
  imports: [UserModule],
  controllers: [ProjectNoteController],
})
export class ProjectNoteModule {}
