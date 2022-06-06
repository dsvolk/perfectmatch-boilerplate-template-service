import { Controller, Get, Inject } from '@nestjs/common';
import { ApiExtraModels, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { IOnboardingService, ONBOARDING_SERVICE } from '../../../services/interfaces/onboarding.service.interface';
import { UserOnboardingResponseDto } from '../../../models/dto/response/user-onboarding-response.dto';
import { MongoDbQueryBuilder } from '../../../../../shared/decorators/query-builder.decorator';
import { Ictx } from '../../../../../shared/decorators/invocation-context/invocation-context.decorator';
import { FindManyOptions } from 'typeorm';
import { InvocationContext } from '../../../../../shared/interfaces/invocation-context.interface';
import { ApiErrors } from '../../../../../shared/enums/api-error.enum';
import {
  ApiPaginatedResponseDto,
  PaginationResponseDto,
} from '../../../../../shared/models/dto/pagination-response.dto';

@ApiTags('Onboarding')
@Controller('v1/onboarding')
export class OnboardingController {
  private readonly logger = new AppLogger(OnboardingController.name);

  constructor(@Inject(ONBOARDING_SERVICE) private readonly onboardingService: IOnboardingService) {
    this.logger.log('Init');
  }

  @Get()
  @ApiOperation({ description: 'Get user onboardings' })
  @ApiExtraModels(UserOnboardingResponseDto) // force swagger to index this class as schema
  @ApiPaginatedResponseDto(UserOnboardingResponseDto)
  @ApiInternalServerErrorResponse({ description: ApiErrors.InternalServerError })
  async getUserOnboardings(
    @Ictx() ctx: InvocationContext,
    @MongoDbQueryBuilder() query: FindManyOptions,
  ): Promise<PaginationResponseDto<UserOnboardingResponseDto>> {
    return await this.onboardingService.getUserOnboardings(ctx, query);
  }
}
