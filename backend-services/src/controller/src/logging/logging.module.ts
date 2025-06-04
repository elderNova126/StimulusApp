import { Module, Global } from '@nestjs/common';
import { StimulusLogger } from './stimulus-logger.service';
import { WinstonLoggingProvider } from './winston.provider';
import { Logger, LoggerOptions } from 'winston';
import { StimulusDbLogger } from './stimulus-db-logger.service';
import { StimulusDbLoggerOptions } from './logger-options';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';

@Global()
@Module({
  providers: [
    {
      provide: StimulusLogger,
      useFactory: (logger: Logger, reqContextResolutionService: ReqContextResolutionService) => {
        return new StimulusLogger(logger, reqContextResolutionService);
      },
      inject: ['WINSTON_LOGGER_PROVIDER', ReqContextResolutionService],
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
    ReqContextResolutionService,
  ],
  exports: [StimulusLogger, ReqContextResolutionService],
})
export class LoggingModule {
  public static createStimulusLogger(): StimulusLogger {
    return new StimulusLogger(
      WinstonLoggingProvider.createWinstonLogger(WinstonLoggingProvider.createWinstonLoggingOptions())
    );
  }
  public static createStimulusDbLogger(): StimulusDbLogger {
    return new StimulusDbLogger(
      WinstonLoggingProvider.createWinstonLogger(WinstonLoggingProvider.createWinstonLoggingOptions()),
      new StimulusDbLoggerOptions('Query|Schema|Error|Warn|Info|Log|Migration')
    );
  }
}
