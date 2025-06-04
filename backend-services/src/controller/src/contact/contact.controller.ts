import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { ContactService } from './contact.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Contact } from './contact.entity';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('contact')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ContactController {
  constructor(private contactService: ContactService) {}

  @GrpcMethod('DataService', 'SearchContacts')
  async searchContacts(data: any): Promise<{ results: Contact[]; count: number }> {
    const { contact, query } = data;
    const [results, count] = await this.contactService.getContacts(contact, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateContact')
  createContact(data: any): Promise<Contact> {
    const { dataTraceSource, userId, traceFrom, contact } = data;
    return this.contactService.createContact(contact, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'DeleteContact')
  async deleteContact(data: any): Promise<any> {
    const { id } = data;
    const res = await this.contactService.deleteContact(id);
    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateContact')
  updateContact(data: any): Promise<Contact> {
    const { dataTraceSource, userId, traceFrom, contact: contactData } = data;
    const { id, ...contact } = contactData;
    return this.contactService.updateContact(id, contact, { dataTraceSource, meta: { userId, method: traceFrom } });
  }
}
