import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ContactArgs, ContactSearchArgs } from '../dto/contactArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { ContactResponseUnion, ContactUnion } from '../models/contact';

@Injectable()
export class ContactService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async searchContacts(contactSearchArgs: ContactSearchArgs): Promise<typeof ContactResponseUnion> {
    const { query, companyId, ...contact } = contactSearchArgs;
    const contactSearchGrpcArgs: any = { query, contact };

    if (typeof companyId !== 'undefined') {
      contactSearchGrpcArgs.contact.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchContacts,

      contactSearchGrpcArgs
    );
  }

  createContact(contactArgs: ContactArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof ContactUnion> {
    const { companyId, ...contactData } = contactArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const createContactArgs = companyId ? { ...contactData, company: { id: companyId } } : contactData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createContact, {
      contact: createContactArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteContact(contactArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteContact, contactArgs);
  }

  updateContact(contactArgs: ContactArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof ContactUnion> {
    const { companyId, ...contactData } = contactArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const updateContactArgs = companyId ? { ...contactData, company: { id: companyId } } : contactData;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateContact, {
      contact: updateContactArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
