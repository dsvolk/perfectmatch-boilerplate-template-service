import { AppTester } from '../../../../infra/app-tester';
import { INestApplication } from '@nestjs/common';
import { clearAllDbData } from '../../../../infra/db.utils';
import { OnboardingController } from '../../../../../src/modules/onboarding/controllers/api/v1/onboarding.controller';

/**
 * PATHS
 */
const getManyPath = () => `/v1/onboarding`;

/**
 * UTILS
 */
let tester: AppTester;
let app: INestApplication;

describe(OnboardingController.name + ': Get user onboardings', () => {
  beforeAll(async () => {
    tester = await AppTester.create();
    app = tester.app;
  });

  beforeEach(async () => {
    await clearAllDbData();
  });

  it('Controller should be defined', async () => {
    expect(tester.scaffold.get<OnboardingController>(OnboardingController)).toBeDefined();
  });

  afterAll(async () => {
    await tester.teardown();
  });
});
