import { Injectable } from '@nestjs/common';
import { UserOnboardingRepository } from '../repositories/user-onboarding.repository';
import { IOnboardingService } from './interfaces/onboarding.service.interface';
import { InvocationContext } from '../../../shared/interfaces/invocation-context.interface';
import { KafkaProducer } from '../../../shared/kafka/kafka-producer';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { FindManyOptions } from 'typeorm';
import { TransformerUtils } from '../../../shared/utils/transformer.utils';
import { UserOnboardingTransformer } from '../transformers/user-onboarding.transformer';
import { PaginationResponseDto } from '../../../shared/models/dto/pagination-response.dto';
import { UserOnboardingResponseDto } from '../models/dto/response/user-onboarding-response.dto';

@Injectable()
export class OnboardingService implements IOnboardingService {
  private readonly logger = new AppLogger(OnboardingService.name);

  constructor(
    private readonly userOnboardingRepository: UserOnboardingRepository,
    private readonly kafkaProducer: KafkaProducer,
  ) {
    this.logger.log('Init');
  }

  public async getUserOnboardings(
    ctx: InvocationContext,
    query: FindManyOptions,
  ): Promise<PaginationResponseDto<UserOnboardingResponseDto>> {
    const [data, count] = await this.userOnboardingRepository.findAndCount(query);
    const responseDtos = TransformerUtils.transformArray(data, UserOnboardingTransformer.entityToResponseDto);
    return new PaginationResponseDto<UserOnboardingResponseDto>(query, count, responseDtos);
  }
}
