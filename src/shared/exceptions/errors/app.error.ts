import { HttpException, HttpStatus } from '@nestjs/common';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { InvocationContext } from '../../interfaces/invocation-context.interface';

export class AppError extends HttpException {
  private readonly internalErrorCode: AppInternalErrorCode;
  private readonly invocationContext: InvocationContext;

  constructor(
    internalErrorCode: AppInternalErrorCode,
    message: string,
    status: HttpStatus,
    invocationContext?: InvocationContext,
    public readonly additionalInfo?: object,
    public fieldsErrors: string[] = null,
  ) {
    super(message, status);
    this.internalErrorCode = internalErrorCode;
    this.invocationContext = invocationContext;
  }

  public getErrorCode(): AppInternalErrorCode {
    return this.internalErrorCode;
  }

  public getInvocationContext(): InvocationContext {
    return this.invocationContext;
  }
}
