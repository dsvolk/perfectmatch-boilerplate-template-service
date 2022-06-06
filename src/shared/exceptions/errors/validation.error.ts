import { AppError } from './app.error';

import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class ValidationError extends AppError {
  constructor(
    message: string,
    invocationContext?: InvocationContext,
    additionalInfo?: object,
    fieldsErrors?: string[],
  ) {
    super(
      AppInternalErrorCode.ValidationError,
      message,
      HttpStatus.BAD_REQUEST,
      invocationContext,
      additionalInfo,
      fieldsErrors,
    );
  }
}
