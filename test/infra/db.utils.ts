import { AppTester } from './app-tester';
import { MongoRepository } from 'typeorm';
import { UserOnboarding } from '../../src/modules/onboarding/models/domain/user-onboarding.entity';

export function userOnboardingRepository(): MongoRepository<UserOnboarding> {
  return AppTester.instance.connection.getMongoRepository(UserOnboarding);
}

/** Drop all collections, and ignore a 'collection not found' error */
export async function clearAllDbData() {
  try {
    await userOnboardingRepository().clear();
  } catch (e) {
    if (e.codeName !== 'NamespaceNotFound') throw e;
  }
}
