import { Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  private readonly reportRepository: Repository<Report>;

  constructor(@Inject(TENANT_CONNECTION) connection) {
    this.reportRepository = connection.getRepository(Report);
  }

  async getAllReports() {
    return this.reportRepository.find();
  }
}
