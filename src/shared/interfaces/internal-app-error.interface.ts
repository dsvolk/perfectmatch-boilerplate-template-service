import { HttpStatus } from '@nestjs/common';

export interface InternalAppError {
  internalErrorCode: number;
  message: string;
  fieldsErrors: string[];
  timestamp: string;
  path: string;
  statusCode: HttpStatus;
}
