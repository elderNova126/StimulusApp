import { Inject, Injectable } from '@nestjs/common';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { Connection, In, Repository } from 'typeorm';
import { DiverseOwnership } from './DiverseOwnership.entity';
import { DiverseOwnershipCompany } from './DiverseOwnershipCompany.entity';

@Injectable()
export class DiverseOwnershipService {
  private readonly diverseOwnershipRepository: Repository<DiverseOwnership>;
  private readonly diverseOwnershipCompanyRepository: Repository<DiverseOwnershipCompany>;

  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.diverseOwnershipRepository = connection.getRepository(DiverseOwnership);
    this.diverseOwnershipCompanyRepository = connection.getRepository(DiverseOwnershipCompany);
  }

  // get all diverse ownerships
  async findAll(): Promise<DiverseOwnership[]> {
    return this.diverseOwnershipRepository.find();
  }

  // get diverse ownership by id
  async findById(id: string): Promise<DiverseOwnership> {
    return this.diverseOwnershipRepository.findOne(id);
  }

  // get diverse ownership by name
  async findByName(name: string): Promise<DiverseOwnership> {
    return this.diverseOwnershipRepository.findOne({
      where: {
        diverseOwnership: name,
      },
    });
  }

  async getDiverseOwnershipByCompanyId(companyId: string): Promise<{ values: DiverseOwnership[]; total: number }> {
    try {
      const result = await this.diverseOwnershipCompanyRepository.find({
        where: {
          companyId,
        },
      });

      // get diverse ownership by id
      const diverseOwnership = await this.diverseOwnershipRepository.findByIds(
        result.map((diverseOwnership) => diverseOwnership.diverseOwnershipId)
      );

      return { values: diverseOwnership, total: diverseOwnership.length };
    } catch (error) {
      throw error;
    }
  }

  // update diverse ownership company

  async findBydiverseOwnership(diverseOwnershipValues: string[]): Promise<DiverseOwnership[]> {
    try {
      // find all new diverse ownerships
      const toSavedDiverseOwnership = await this.diverseOwnershipRepository.find({
        where: {
          diverseOwnership: In(diverseOwnershipValues),
        },
      });
      return toSavedDiverseOwnership;
    } catch (error) {
      throw error;
    }
  }
}
