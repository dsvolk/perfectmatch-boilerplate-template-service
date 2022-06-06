import { InvocationContext } from '../../../../shared/interfaces/invocation-context.interface';
import { FindManyOptions } from 'typeorm';
import { PaginationResponseDto } from '../../../../shared/models/dto/pagination-response.dto';
import { UserOnboardingResponseDto } from '../../models/dto/response/user-onboarding-response.dto';

export const ONBOARDING_SERVICE = 'ONBOARDING_SERVICE';

export interface IOnboardingService {
  getUserOnboardings(
    ctx: InvocationContext,
    query: FindManyOptions,
  ): Promise<PaginationResponseDto<UserOnboardingResponseDto>>;
}
