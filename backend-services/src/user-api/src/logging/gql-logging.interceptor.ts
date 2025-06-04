import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StimulusLogger } from './stimulus-logger.service';
import { v4 as uuid } from 'uuid';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class GqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StimulusLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reqContext = GqlExecutionContext.create(context);
    const request = reqContext.getContext().req;
    const rid: string = uuid();
    this.logger.context = {
      name: GqlLoggingInterceptor.name,
      requestId: rid,
    };
    this.logger.log(
      `${request.method} ${request.originalUrl}${request.url} ${context.getClass().name}:${context.getHandler().name}`
    );
    this.logger.debug(JSON.stringify(request.headers));
    if (Object.keys(request.params).length) {
      this.logger.log(JSON.stringify(request.params));
    }
    if (Object.keys(request.query).length) {
      this.logger.log(JSON.stringify(request.query));
    }
    if (Object.keys(request.body).length) {
      this.logger.log(JSON.stringify(request.body));
    }
    const now = Date.now();
    return next.handle().pipe(
      tap(
        () => {
          this.logger.log(`Execution time ${Date.now() - now}ms`);
        },
        (error) => {
          error.message = `[${rid}] ` + error.message;
        }
      )
    );
  }
}
