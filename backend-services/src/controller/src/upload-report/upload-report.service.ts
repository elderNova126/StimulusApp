import { TENANT_CONNECTION } from './../database/database.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';

import { UploadReport } from './upload-report.entity';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { UploadReportErrors } from './upload-report-errors.entity';

@Injectable()
export class UploadReportService {
  private readonly uploadReportRepository: Repository<UploadReport>;
  private readonly uploadReportErrorsRepository: Repository<UploadReportErrors>;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection,
    protected readonly logger: StimulusLogger
  ) {
    this.uploadReportRepository = tenantConnection.getRepository(UploadReport);
    this.uploadReportErrorsRepository = tenantConnection.getRepository(UploadReportErrors);
    this.logger.context = UploadReportService.name;
  }

  getUploadReports(data: { nameIn: string[]; uploadReport: UploadReport }) {
    const filters: any = data.uploadReport ?? {};

    if (data.nameIn?.length) {
      filters.where = { fileName: In(data.nameIn) };
    }
    return this.uploadReportRepository.findAndCount(filters);
  }

  async createUploadReport(fileName, userId) {
    return this.uploadReportRepository.save({ fileName, userId });
  }

  deleteUploadReport(id: string) {
    return this.uploadReportRepository.delete(id);
  }

  async updateUploadReport(id, data) {
    const report = await this.uploadReportRepository.findOneOrFail(id);

    return this.uploadReportRepository.save({
      ...report,
      ...data,
    });
  }

  async streamUpdates(id, successIds, errors?): Promise<UploadReport> {
    const report = await this.uploadReportRepository.findOneOrFail(id);

    let reportErrors = await report.errors;

    if (reportErrors === null || reportErrors === undefined) {
      reportErrors = new UploadReportErrors();
    }

    reportErrors.errors = [...(reportErrors?.errors ?? []), ...(errors ?? [])];

    report.errorsCount += errors?.length ?? 0;

    await this.uploadReportErrorsRepository.save(reportErrors);

    report.errors = Promise.resolve(reportErrors);

    await this.uploadReportRepository.save(report);

    return this.uploadReportRepository
      .save({
        ...report,
        affectedCompanies: [...new Set(successIds.concat(report.affectedCompanies ?? []))] as string[],
      })
      .catch((err) => {
        this.logger.log('Error settings stats to upload report after a stream ends: ', err);
        return null;
      });
  }

  async addUploadReportError(id, error) {
    const report = await this.uploadReportRepository.findOneOrFail(id);

    const reportErrors = await report.errors;

    reportErrors.errors = [...(reportErrors.errors ?? []), error];

    report.errorsCount++;

    await this.uploadReportErrorsRepository.save(reportErrors);
    report.errors = Promise.resolve(reportErrors);

    return this.uploadReportRepository.save(report);
  }
}
