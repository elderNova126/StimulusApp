import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger } from 'winston';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
@Injectable({ scope: Scope.TRANSIENT })
export class StimulusLogger implements LoggerService {
  private internalContext?: any;

  constructor(
    private readonly logger: Logger,
    private readonly reqContextResolutionService?: ReqContextResolutionService
  ) {}

  set context(context: any) {
    this.internalContext = context;
  }

  private resolveCurrentContext(context: any) {
    const currentContext: any = {};
    if (this.reqContextResolutionService) {
      currentContext.requestId = this.reqContextResolutionService.getRequestId();
    }
    if (context) {
      currentContext.context = context;
    } else if (this.internalContext) {
      currentContext.context = this.internalContext;
    }
    return { ...currentContext };
  }

  public log(message: any, context?: any) {
    return this.logger.info(message, this.resolveCurrentContext(context));
  }

  public error(message: any, trace?: string, context?: any): any {
    return this.logger.error(message, {
      trace,
      ...this.resolveCurrentContext(context),
    });
  }

  public warn(message: any, context?: any): any {
    return this.logger.warn(message, this.resolveCurrentContext(context));
  }

  public debug?(message: any, context?: any): any {
    return this.logger.debug(message, this.resolveCurrentContext(context));
  }

  public verbose?(message: any, context?: any): any {
    return this.logger.verbose(message, this.resolveCurrentContext(context));
  }
}
