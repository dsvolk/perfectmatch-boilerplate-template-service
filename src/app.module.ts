import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TypeOrmSqlConfigService } from './shared/database/type-orm-sql-config.service';
import { SharedModule } from './shared/shared.module';
import { CorrelationIdMiddleware } from './shared/middlewares/correlation-id/correlation-id.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './shared/interceptors/cache.interceptor';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { AllExceptionFilter } from './shared/exceptions/exception-filters/all-exception.filter';
import { ValidationExceptionFilter } from './shared/exceptions/exception-filters/validation-exception.filter';
import { AppExceptionFilter } from './shared/exceptions/exception-filters/app-exception.filter';
import { TypeormExceptionFilter } from './shared/exceptions/exception-filters/typeorm-exception.filter';
import { OnboardingModule } from './modules/onboarding/onboarding.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule, OnboardingModule],
      useExisting: TypeOrmSqlConfigService,
    } as TypeOrmModuleAsyncOptions),
    SharedModule,
    OnboardingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeormExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
