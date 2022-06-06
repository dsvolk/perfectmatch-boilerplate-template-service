import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '../../shared/middlewares/logger.middleware';
import { SharedModule } from '../../shared/shared.module';
import { OnboardingController } from './controllers/api/v1/onboarding.controller';
import { ONBOARDING_SERVICE } from './services/interfaces/onboarding.service.interface';
import { OnboardingService } from './services/onboarding.service';
import { UserOnboarding } from './models/domain/user-onboarding.entity';
import { UserOnboardingRepository } from './repositories/user-onboarding.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOnboarding, UserOnboardingRepository]), SharedModule],
  controllers: [OnboardingController],
  providers: [
    {
      provide: ONBOARDING_SERVICE,
      useClass: OnboardingService,
    },
  ],
  exports: [],
})
export class OnboardingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
