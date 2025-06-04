import { Module, Global } from '@nestjs/common';
import { StimulusLogger } from './stimulus-logger.service';
import { WinstonLoggingProvider } from './winston.provider';
import { Logger, LoggerOptions } from 'winston';
import { RequestIdService } from '../core/request-id.service';

@Global()
@Module({
  providers: [
    {
      provide: StimulusLogger,
      useFactory: (logger: Logger, requestIdService: RequestIdService) => {
        return new StimulusLogger(logger, requestIdService);
      },
      inject: ['WINSTON_LOGGER_PROVIDER', RequestIdService],
    },
    {
      provide: 'WINSTON_LOGGER_PROVIDER',
      useFactory: (loggerOpts: LoggerOptions) => {
        return WinstonLoggingProvider.createWinstonLogger(loggerOpts);
      },
      inject: ['WINSTON_LOGGER_OPTIONS'],
    },
    {
      provide: 'WINSTON_LOGGER_OPTIONS',
      useFactory: () => {
        return WinstonLoggingProvider.createWinstonLoggingOptions();
      },
    },
    RequestIdService,
  ],
  exports: [StimulusLogger, RequestIdService],
})
export class LoggingModule {
  public static createStimulusLogger(): StimulusLogger {
    return new StimulusLogger(
      WinstonLoggingProvider.createWinstonLogger(WinstonLoggingProvider.createWinstonLoggingOptions())
    );
  }
}
