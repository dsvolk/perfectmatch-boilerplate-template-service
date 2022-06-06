import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { OnboardingController } from '../../modules/onboarding/controllers/api/v1/onboarding.controller';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  /**
   * using the context here, we can specify different timeout values for specific controllers and/or function names
   * for example here, we override the 'this_endpoint_does_not_exist' @ OnboardingController timeout (and increase it, intentionally :) )
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    if (context?.getClass().name === OnboardingController.name) {
      if (context?.getHandler().name === 'this_endpoint_does_not_exist') {
        return next.handle().pipe(timeout(this.configService.requestTimeoutMs * 2));
      }
    }
    return next.handle().pipe(timeout(this.configService.requestTimeoutMs));
  }
}
