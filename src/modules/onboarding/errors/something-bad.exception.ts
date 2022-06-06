import { AppError } from '../../../shared/exceptions/errors/app.error';
import { AppInternalErrorCode } from '../../../shared/exceptions/app-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { InvocationContext } from '../../../shared/interfaces/invocation-context.interface';

export class SomethingBadException extends AppError {
  constructor(ctx: InvocationContext, message?: string) {
    super(
      AppInternalErrorCode.Unknown,
      message ? message : 'Something bad happened',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ctx,
    );
  }
}
