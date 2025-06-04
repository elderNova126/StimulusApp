/*
 * Copyright (C) 2020 Kokoon - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StimulusLogger } from './stimulus-logger.service';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StimulusLogger) {
    this.logger.context = RequestLoggingInterceptor.name;
  }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const req: Request = context.switchToHttp().getRequest<Request>();
        const res: Response = context.switchToHttp().getResponse<Response>();
        const message = `${req.method} ${req.url} ${req.protocol}/${req.httpVersion} ${req.get('user-agent')} ${
          res.statusCode
        } ${Date.now() - now}ms`;
        this.logger.log(message);
      }),
      catchError((err) => {
        this.logger.error(err);
        return throwError(err);
      })
    );
  }
}
