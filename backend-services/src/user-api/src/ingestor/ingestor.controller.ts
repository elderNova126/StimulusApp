import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { IngestorService } from './ingestor.service';
import { SAS } from './sas.interface';

@Controller()
export class IngestorController {
  constructor(
    private readonly logger: StimulusLogger,
    private readonly ingestorService: IngestorService
  ) {}

  @Get('sas/')
  async generateSAS(): Promise<SAS> {
    try {
      return await this.ingestorService.generateSAS();
    } catch (error) {
      this.logger.error(`Failed to generate azure sas url`, error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
