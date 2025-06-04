import { Inject, Injectable } from '@nestjs/common';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { CompanyNames, CompanyNameType } from './company-names.entity';
import { removeDuplicateString } from 'src/utils/Strings';

import { GrpcInvalidArgumentException } from '../shared/utils-grpc/exception';
@Injectable()
export class CompanyNamesService {
  private readonly namesRepository: Repository<CompanyNames>;
  private readonly castValue = '| ';
  private readonly SanitizerRegex = /,$/;
  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger
  ) {
    this.namesRepository = connection.getRepository(CompanyNames);
  }

  async getCompanyNames(companyId: string) {
    try {
      const names = await this.namesRepository.find({
        where: { companyId },
        order: { created: 'DESC' },
      });
      return names;
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(error.message);
    }
  }

  async saveCompanyNames(companyId: string, type: CompanyNameType, names: string[]) {
    try {
      const NamesToSaves = names.map((name) => ({ type, name, companyId }) as CompanyNames);
      return this.namesRepository.save(NamesToSaves);
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(error.message);
    }
  }

  async UpdateNames(companyId: string, type: CompanyNameType, names: string[] | string) {
    if (!names) return [];
    let castNames = typeof names === 'string' ? names.split(this.castValue) : names;
    castNames = this.sanitizerValues(castNames);

    try {
      const deleteRes = await this.namesRepository.delete({ companyId, type });
      this.logger.debug(`Delete ${deleteRes.affected} names`);
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(error.message);
    }

    if (castNames.length === 0 || castNames[0] === '') {
      return [];
    }
    return this.saveCompanyNames(companyId, type, castNames);
  }

  sanitizerValues(values: string[]) {
    const newNames = values
      .map((value) => value.trim().replace(this.SanitizerRegex, ''))
      .filter((value) => value !== '');
    return removeDuplicateString(newNames);
  }
}
