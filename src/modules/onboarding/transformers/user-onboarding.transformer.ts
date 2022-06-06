import { UserOnboarding } from '../models/domain/user-onboarding.entity';
import { UserOnboardingResponseDto } from '../models/dto/response/user-onboarding-response.dto';

export class UserOnboardingTransformer {
  public static entityToResponseDto(entity: UserOnboarding): UserOnboardingResponseDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
