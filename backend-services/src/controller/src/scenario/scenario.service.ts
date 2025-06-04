import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { IOrder, IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { Scenario } from './scenario.entity';

@Injectable()
export class ScenarioService {
  private readonly scenarioRepository: Repository<Scenario>;

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.scenarioRepository = connection.getRepository(Scenario);
  }

  getScenarios(filters: Scenario, pagination: IPaginationDTO, order: IOrderDTO): Promise<any[]> {
    const { key = 'id', direction = 'ASC' } = order;

    const paginationParams: IPagination = pagination.limit && {
      take: pagination.limit,
      skip: pagination.limit * (pagination.page - 1),
    };

    const orderParams: IOrder = {
      [key]: direction,
    };

    return this.scenarioRepository.findAndCount({
      where: [{ public: true }, filters],
      order: orderParams,
      ...paginationParams,
    });
  }

  createScenario(scenarioData: Scenario): Promise<Scenario> {
    return this.scenarioRepository.save(scenarioData);
  }

  async updateScenario(id: number, scenarioData: Scenario): Promise<Scenario> {
    const scenario = await this.scenarioRepository.findOneOrFail({ where: { id } });

    if (scenario.userId !== scenarioData.userId) {
      return this.scenarioRepository.save({ ...scenarioData, id });
    } else {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
  }

  async deleteScenario(id: number, userId: string): Promise<DeleteResult> {
    const scenario = await this.scenarioRepository.findOneOrFail({ where: { id } });

    if (scenario.userId === userId) {
      return this.scenarioRepository.delete(id);
    } else {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
  }
}
