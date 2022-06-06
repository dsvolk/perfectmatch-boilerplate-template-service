import { EntityRepository, MongoRepository } from 'typeorm';
import { UserOnboarding } from '../models/domain/user-onboarding.entity';

@EntityRepository(UserOnboarding)
export class UserOnboardingRepository extends MongoRepository<UserOnboarding> {}
