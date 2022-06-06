import { AppError } from './app.error';

import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { AppInternalErrorCode } from '../app-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

const message = 'Got an error when trying to produce kafka message';

export class KafkaProduceError extends AppError {
  constructor(invocationContext?: InvocationContext, additionalInfo?: object) {
    super(
      AppInternalErrorCode.KafkaProduceError,
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      invocationContext,
      additionalInfo,
    );
  }
}
