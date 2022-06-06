import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { InvocationContextUtil } from '../../decorators/invocation-context.util';
import { InvocationContext } from '../../interfaces/invocation-context.interface';

@Catch(Error)
export class AllExceptionFilter implements ExceptionFilter<Error> {
  private logger: AppLogger = new AppLogger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    try {
      const context = host.switchToHttp();
      const request = context.getRequest();
      const response = context.getResponse();
      const ctx: InvocationContext = InvocationContextUtil.createInvocationContextFromRequest(request);
      const errorName = _.get(exception, 'response.error');
      const statusCode = _.get(exception, 'response.statusCode') || HttpStatus.INTERNAL_SERVER_ERROR;
      const internalErrorCode = AppInternalErrorCode.Unknown;

      const error = {
        internalErrorCode,
        message: `${exception.name}: ${errorName ? `${errorName}:` : ''} ${exception.message}`,
        fieldsErrors: [],
        timestamp: new Date().toISOString(),
        path: `${request.method} ${request.url}`,
        statusCode,
      };

      this.logger.error('Uncaught exception', exception, ctx, {
        errorResponse: error,
        internalErrorCode: internalErrorCode,
      });

      // Override message for 'secret' exceptions not to be exposed to the client
      if (exception) {
        switch (exception.name) {
          case 'NotFoundException':
            break;
          default:
            error.message = 'Internal server error';
        }
      }

      response.status(statusCode).json(error);
    } catch (e) {
      const context = host.switchToHttp();
      const request = context.getRequest();
      const response = context.getResponse();
      const ctx: InvocationContext = InvocationContextUtil.createInvocationContextFromRequest(request);
      const internalErrorCode = AppInternalErrorCode.Unknown;

      this.logger.error('Failed to process unknown exception', exception, ctx, {
        runtimeParseError: e.message ? e.message : e,
        internalErrorCode: internalErrorCode,
      });

      const error = {
        internalErrorCode,
        message: 'Unknown server error occurred',
        fieldsErrors: [],
        timestamp: new Date().toISOString(),
        path: `${request.method} ${request.url}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
