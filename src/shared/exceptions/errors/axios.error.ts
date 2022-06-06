import { Consts } from '../../config/consts';
import { AppError } from './app.error';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { InvocationContext } from '../../interfaces/invocation-context.interface';

export class AxiosError extends AppError {
  constructor(
    private readonly url,
    private readonly method,
    private readonly headers,
    private readonly error,
    private readonly ctx: InvocationContext,
  ) {
    super(AppInternalErrorCode.ExternalServiceError, error, headers['Status'] || HttpStatus.INTERNAL_SERVER_ERROR, ctx);
    this.message = `Response: ${this.method} ${this.url} - ${this.headers[Consts.correlationIdHeaderName]} - Error:${
      this.error
    }`;
  }
}
