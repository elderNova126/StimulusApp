import { Module } from '@nestjs/common';
import { ProjectNoteResolver } from './project-note.resolver';
import { ProjectNoteService } from './project-note.service';

@Module({
  providers: [ProjectNoteResolver, ProjectNoteService],
})
export class ProjectNoteModule {}
