import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter, GqlExceptionFilter {
  catch(exception: GraphQLError, host: ArgumentsHost) {
    const gqlHost = host.getType<GqlContextType>() === 'graphql';

    // Handle GraphQL errors
    if (gqlHost) {
      return this.handleGraphQLException(exception);
    }

    // Handle HTTP errors
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal server error',
    };

    response.status(status).json(errorResponse);
  }

  private handleGraphQLException(exception: GraphQLError) {
    if (exception instanceof HttpException) {
      return new Error(exception.getResponse()['message'] || 'HTTP Exception');
    }
    if (process.env.DIAGNOSTICS_LOGGING_ENABLED === 'true') {
      return exception;
    } else {
      return new Error('Internal server error');
    }
  }
}
