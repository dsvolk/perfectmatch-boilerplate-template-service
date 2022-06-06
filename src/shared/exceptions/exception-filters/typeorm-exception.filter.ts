import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { CannotCreateEntityIdMapError, EntityNotFoundError, MongoError, QueryFailedError, TypeORMError } from 'typeorm';
import { AppInternalErrorCode, TypeOrmErrorMessage } from '../app-error-codes.enum';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { InvocationContextUtil } from '../../decorators/invocation-context.util';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeormExceptionFilter implements ExceptionFilter<MongoError> {
  private logger: AppLogger = new AppLogger(TypeormExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const ctx: InvocationContext = InvocationContextUtil.createInvocationContextFromRequest(request);
    let internalErrorCode = AppInternalErrorCode.Unknown;
    let statusCode;
    let message;

    switch (exception.constructor) {
      case QueryFailedError: // this is a TypeOrm error
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        message = TypeOrmErrorMessage.QueryFailed;
        break;
      case CannotCreateEntityIdMapError: // and another
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        message = TypeOrmErrorMessage.CannotCreateEntity;
        break;
      case EntityNotFoundError: // and another
        statusCode = HttpStatus.NOT_FOUND;
        message = TypeOrmErrorMessage.EntityNotFound;
        internalErrorCode = AppInternalErrorCode.EntityNotFound;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const error = {
      internalErrorCode,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: `${request.method} ${request.url}`,
    };

    this.logger.error(message || 'Unknown typeorm exception', exception, ctx, {
      errorResponse: error,
      internalErrorCode: internalErrorCode,
    });
    response.status(statusCode).json(error);
  }
}
