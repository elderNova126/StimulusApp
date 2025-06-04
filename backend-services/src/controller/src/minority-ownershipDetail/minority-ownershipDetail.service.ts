import { Inject, Injectable } from '@nestjs/common';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { Connection, Repository, In } from 'typeorm';
import { MinorityOwnershipDetail } from './minorityOwnershipDetail.entity';
import { MinorityOwnershipDetailCompany } from './minorityOwnershipDetailCompany.entity';

@Injectable()
export class MinorityOwnershipDetailService {
  private readonly minorityOwnershipDetailRepository: Repository<MinorityOwnershipDetail>;
  private readonly minorityOwnershipDetailCompanyRepository: Repository<MinorityOwnershipDetailCompany>;

  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.minorityOwnershipDetailRepository = connection.getRepository(MinorityOwnershipDetail);
    this.minorityOwnershipDetailCompanyRepository = connection.getRepository(MinorityOwnershipDetailCompany);
  }

  // get all diverse ownerships
  async findAll(): Promise<MinorityOwnershipDetail[]> {
    return this.minorityOwnershipDetailRepository.find();
  }

  // get diverse ownership by id
  async findById(id: string): Promise<MinorityOwnershipDetail> {
    return this.minorityOwnershipDetailRepository.findOne(id);
  }

  // get diverse ownership by name
  async findByName(name: string): Promise<MinorityOwnershipDetail> {
    return this.minorityOwnershipDetailRepository.findOne({
      where: {
        diverseOwnership: name,
      },
    });
  }

  async getMinorityOwnershipByCompanyId(
    companyId: string
  ): Promise<{ values: MinorityOwnershipDetail[]; total: number }> {
    try {
      const result = await this.minorityOwnershipDetailCompanyRepository.find({
        where: {
          companyId,
        },
      });

      // get diverse ownership by id
      const minorityOwnership = await this.minorityOwnershipDetailRepository.findByIds(
        result.map((minorityOwnership) => minorityOwnership.minorityOwnershipDetailId)
      );

      return { values: minorityOwnership, total: minorityOwnership.length };
    } catch (error) {
      throw error;
    }
  }

  // update diverse ownership company

  async findBydiverseOwnership(minorityOwnershipValues: string[]): Promise<MinorityOwnershipDetail[]> {
    try {
      // find all new diverse ownerships
      const toSavedDiverseOwnership = await this.minorityOwnershipDetailRepository.find({
        where: {
          minorityOwnershipDetail: In(minorityOwnershipValues),
        },
      });
      return toSavedDiverseOwnership;
    } catch (error) {
      throw error;
    }
  }
}
