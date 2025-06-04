import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { Scenario } from './scenario.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('scenario')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ScenarioController {
  constructor(private scenarioService: ScenarioService) {}

  @GrpcMethod('DataService', 'SearchScenarios')
  async searchScenarios(data: any): Promise<{ results: Scenario[]; count: number }> {
    const { scenario: filters, pagination, order } = data;
    const [results, count] = await this.scenarioService.getScenarios(filters, pagination, order);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateScenario')
  async createScenario(data: any): Promise<Scenario> {
    return this.scenarioService.createScenario(data.scenario);
  }

  @GrpcMethod('DataService', 'DeleteScenario')
  async deleteScenario(data: any): Promise<any> {
    const { id, userId } = data;
    const res = await this.scenarioService.deleteScenario(id, userId);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateScenario')
  async updateScenario(data: any): Promise<Scenario> {
    const { id, ...scenario } = data.scenario;

    return this.scenarioService.updateScenario(id, scenario);
  }
}
