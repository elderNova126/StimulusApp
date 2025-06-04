import { transports, format, createLogger, Logger, LoggerOptions } from 'winston';

export class WinstonLoggingProvider {
  static createWinstonLoggingOptions(): LoggerOptions {
    const consoleTransport = new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: format.simple(),
    });

    const fileTransport = new transports.File({ filename: 'controller-logger.log' });

    const isLocal = process.env.ENVIRONMENT === 'local';

    return {
      transports: isLocal ? [consoleTransport, fileTransport] : [consoleTransport],
    };
  }

  static createWinstonLogger(loggerOpts: LoggerOptions): Logger {
    return createLogger(loggerOpts);
  }
}
