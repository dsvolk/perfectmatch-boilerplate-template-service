import { UserOnboarding } from '../../../../src/modules/onboarding/models/domain/user-onboarding.entity';
import { userOnboardingRepository } from '../../../infra/db.utils';

export async function getAllExistingUserOnboardings(): Promise<UserOnboarding[]> {
  return await userOnboardingRepository().find();
}
