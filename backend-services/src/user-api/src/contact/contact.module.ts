import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResolver } from './contact.resolver';

@Module({
  providers: [ContactService, ContactResolver],
  exports: [],
})
export class ContactModule {}
