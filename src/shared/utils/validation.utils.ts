import { ValidationError } from 'class-validator/types/validation/ValidationError';

export class ValidationUtils {
  public static extractErrors(validationErrors: ValidationError[]): string[] {
    if (!validationErrors?.length) {
      return;
    }

    const errorMessages: string[] = [];
    validationErrors.forEach((error: ValidationError) => {
      if (error.constraints) {
        errorMessages.push(...Object.values(error.constraints));
      }
    });

    return errorMessages;
  }
}
