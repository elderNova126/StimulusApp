import { Logger as DbLogger, QueryRunner } from 'typeorm';
import { Logger } from 'winston';
import { StimulusDbLoggerOptions, StimulusDbLoggingContent } from './logger-options';

export class StimulusDbLogger implements DbLogger {
  private readonly dbLoggingContent: StimulusDbLoggingContent;
  private requestId: string;
  constructor(
    private readonly logger: Logger,
    options?: StimulusDbLoggerOptions
  ) {
    this.dbLoggingContent = options?.getLoggingContent();
  }

  private resolveCurrentContext(queryRunner?: QueryRunner): any {
    const currentContext: any = {};
    if (this.requestId) {
      currentContext.requestId = this.requestId;
    }
    currentContext.context = StimulusDbLogger.name;
    currentContext.connection = queryRunner?.connection.name;
    return { context: currentContext };
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!this.canLogContent(StimulusDbLoggingContent.Query)) {
      return;
    }
    const sql = this.getSqlFromQueryAndParams(query, parameters);
    this.logger.info(`query:${sql}`, this.resolveCurrentContext(queryRunner));
  }
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!this.canLogContent(StimulusDbLoggingContent.Error)) {
      return;
    }
    const sql = this.getSqlFromQueryAndParams(query, parameters);
    this.logger.error(`query failed:${sql}`, {
      ...this.resolveCurrentContext(queryRunner),
      trace: error,
    });
  }
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!this.canLogContent(StimulusDbLoggingContent.Query)) {
      return;
    }
    const sql = this.getSqlFromQueryAndParams(query, parameters);
    this.logger.warn(`query is slow:${sql}`, this.resolveCurrentContext(queryRunner));
    this.logger.warn(`execution time:${time}`, this.resolveCurrentContext(queryRunner));
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (!this.canLogContent(StimulusDbLoggingContent.Schema)) {
      return;
    }
    this.logger.info(message, this.resolveCurrentContext(queryRunner));
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    if (!this.canLogContent(StimulusDbLoggingContent.Migration)) {
      return;
    }
    this.logger.info(message, this.resolveCurrentContext(queryRunner));
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        if (this.canLogContent(StimulusDbLoggingContent.Log)) {
          this.logger.info(message, this.resolveCurrentContext(queryRunner));
        }
        break;
      case 'info':
        if (this.canLogContent(StimulusDbLoggingContent.Info)) {
          this.logger.info(`INFO:${message}`, this.resolveCurrentContext(queryRunner));
        }
        break;
      case 'warn':
        if (this.canLogContent(StimulusDbLoggingContent.Warn)) {
          this.logger.warn(message, this.resolveCurrentContext(queryRunner));
          break;
        }
    }
  }

  private canLogContent(loggingContent: StimulusDbLoggingContent) {
    return (
      loggingContent === (this.dbLoggingContent & loggingContent) ||
      StimulusDbLoggingContent.All === (this.dbLoggingContent & StimulusDbLoggingContent.All)
    );
  }

  private getSqlFromQueryAndParams(query: string, parameters?: any[]): string {
    let sql = query;
    if (this.canLogContent(StimulusDbLoggingContent.QueryParams)) {
      sql += parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '';
    }
    return sql;
  }
  private stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters;
    }
  }
}
