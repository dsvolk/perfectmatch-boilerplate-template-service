import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppError } from '../errors/app.error';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { InvocationContextUtil } from '../../decorators/invocation-context.util';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter<AppError> {
  private logger: AppLogger = new AppLogger(AppExceptionFilter.name);

  catch(exception: AppError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const status = exception.getStatus();
    const message = exception.message ? exception.message : 'Error';
    const { fieldsErrors } = exception;
    const internalErrorCode: AppInternalErrorCode = exception.getErrorCode();
    const ctx: InvocationContext =
      exception.getInvocationContext() || InvocationContextUtil.createInvocationContextFromRequest(request);

    const error = {
      internalErrorCode,
      message,
      fieldsErrors: fieldsErrors || [],
      timestamp: new Date().toISOString(),
      path: `${request.method} ${request.url}`,
      statusCode: status,
      correlationId: ctx?.correlationId,
    };

    const additionalInfo: object = {
      ...(exception.additionalInfo || {}),
      internalErrorCode: internalErrorCode,
    };

    this.logger.error(message, exception, ctx, additionalInfo);
    response.status(status).json(error);
  }
}
