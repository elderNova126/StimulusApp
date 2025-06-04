import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';

@Injectable()
export class CoreService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly logger: StimulusLogger
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
    this.logger.context = CoreService.name;
  }

  migrateTenant() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.migrateTenant, {});
  }

  reverseLastMigrationTenant() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.reverseLastTenantMigration, {});
  }

  migrateGlobal() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.migrateGlobal, {});
  }

  UpdateAndReRunIndex() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateAndReRunIndex, {});
  }
}
