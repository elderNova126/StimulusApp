import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StimulusLogger } from './stimulus-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StimulusLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    this.logger.context = LoggingInterceptor.name;
    this.logger.log(`${context.getClass().name}:${context.getHandler().name}`);
    this.logger.log(JSON.stringify(rpcContext.getContext()));
    this.logger.debug(JSON.stringify(rpcContext.getData()));

    const now = Date.now();
    return next.handle().pipe(
      tap(
        () => {
          this.logger.log(`Execution time ${Date.now() - now}ms`);
        },
        (error) => {
          this.logger.error(error.message, error.stack);
        }
      )
    );
  }
}
