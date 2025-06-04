import { ArgumentsHost, Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { Observable, throwError } from 'rxjs';
import { GrpcException } from './exception';

export const isError = (exception: any): exception is Error => {
  return !!(isObject(exception) && (exception as Error).message);
};

@Catch()
export class GrpcExceptionFilter<T = any, R = any> implements RpcExceptionFilter<T> {
  private static readonly logger = new Logger('GrpcExceptionsHandler');

  catch(exception: T & Error, _host: ArgumentsHost): Observable<R> {
    const logger = GrpcExceptionFilter.logger;

    if (!(exception instanceof GrpcException)) {
      if (isError(exception)) logger.error(exception.message, exception.stack);

      return throwError({ code: exception.name, message: exception.message });
    }
    const errorData = exception as GrpcException;
    return throwError(errorData);
  }
}
