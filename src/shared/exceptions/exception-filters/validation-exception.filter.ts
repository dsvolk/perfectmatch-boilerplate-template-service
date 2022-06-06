import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { InvocationContextUtil } from '../../decorators/invocation-context.util';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter<BadRequestException> {
  private logger: AppLogger = new AppLogger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const ctx: InvocationContext = InvocationContextUtil.createInvocationContextFromRequest(request);
    const response = context.getResponse();
    const fieldsErrors = this.extractFieldsError(exception);
    const internalErrorCode = AppInternalErrorCode.ValidationError;

    const error = {
      internalErrorCode,
      message: exception.message,
      fieldsErrors,
      timestamp: new Date().toISOString(),
      path: `${request.method} ${request.url}`,
      statusCode: HttpStatus.BAD_REQUEST,
    };

    this.logger.error(exception.message, exception, ctx, {
      errorResponse: error,
      internalErrorCode: internalErrorCode,
    });
    response.status(HttpStatus.BAD_REQUEST).json(error);
  }

  extractFieldsError(e: BadRequestException): string[] {
    try {
      const msg = _.get(e.getResponse(), 'message');
      if (Array.isArray(msg)) {
        return msg;
      }
      return msg ? [msg] : [];
    } catch (err) {
      this.logger.error(err.message, err);
      return [];
    }
  }
}
