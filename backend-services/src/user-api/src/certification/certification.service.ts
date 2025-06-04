import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { CertificationArgs, CertificationSearchArgs } from '../dto/certificationArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { CertificationResultUnion, CertificationUnion } from '../models/certification';
import { BaseResponse } from './../models/baseResponse';

@Injectable()
export class CertificationService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = controllerGrpcClientDataService.serviceMethods;
  }
  searchCertifications(certificationSearchArgs: CertificationSearchArgs): Promise<typeof CertificationResultUnion> {
    const { query, companyId, ...certification } = certificationSearchArgs;
    const certificationSearchGrpcArgs: any = { query, certification };

    if (typeof companyId !== 'undefined') {
      certificationSearchGrpcArgs.certification.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getCertifications,
      certificationSearchGrpcArgs
    );
  }

  createCertification(
    certificationArgs: CertificationSearchArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof CertificationUnion> {
    const { companyId, ...certification }: any = certificationArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;

    if (companyId) {
      certification.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCertification, {
      certification,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteCertification(certificationArgs: DeleteArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.deleteCertification,
      certificationArgs
    );
  }

  updateCertification(
    certificationArgs: CertificationArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof CertificationUnion> {
    const { companyId, ...rest } = certificationArgs;
    const certificationData = companyId ? { company: { id: companyId }, ...rest } : rest;
    const { dataTraceSource, traceFrom } = tracingArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCertification, {
      certification: certificationData,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
