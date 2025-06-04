import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ScenarioArgs, ScenarioGrpcArgs, ScenarioSearchGrpcArgs } from '../dto/scenarioArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { ScenariosResponseUnion, ScenarioUnion } from '../models/scenario';

@Injectable()
export class ScenarioService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async searchScenarios(scenarioSearchArgs: ScenarioSearchGrpcArgs): Promise<typeof ScenariosResponseUnion> {
    const { page, limit, orderBy, direction, ...scenario } = scenarioSearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };
    const scenarioSearchGrpcArgs: any = { scenario, pagination, order };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchScenarios,
      scenarioSearchGrpcArgs
    );
  }

  createScenario(scenarioArgs: ScenarioArgs): Promise<typeof ScenarioUnion> {
    const { name, userId, public: publicScenario, ...config } = scenarioArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createScenario, {
      scenario: { name, userId, public: publicScenario, config },
    });
  }

  deleteScenario(scenarioArgs: ScenarioGrpcArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteScenario, scenarioArgs);
  }

  updateScenario(scenarioArgs: ScenarioArgs): Promise<typeof ScenarioUnion> {
    const { name, userId, public: publicScenario, ...config } = scenarioArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateScenario, {
      scenario: { name, userId, public: publicScenario, config },
    });
  }
}
