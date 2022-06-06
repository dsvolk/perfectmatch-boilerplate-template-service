import { Inject, Injectable } from '@nestjs/common';
import {
  API_COMMUNICATION_SERVICE,
  ApiCommunicationInterface,
} from '../../api-communication-manager/interfaces/api-communication-manager.interface';
import { ConfigService } from '../../config/config.service';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { PositionNetworkResponseDto } from './models/position-network-response.dto';
import { GetPositionByIdNetworkRequest } from './network-requests/get-position-by-id.network-request';
import { GetPositionsByIdsNetworkRequest } from './network-requests/get-positions-by-ids-network.request';
import { PaginationResponseDto } from '../../models/dto/pagination-response.dto';

@Injectable()
export class PositionService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(API_COMMUNICATION_SERVICE) private readonly apiCommunicationService: ApiCommunicationInterface,
  ) {}

  public async getPositionById(ctx: InvocationContext, positionId: string): Promise<PositionNetworkResponseDto> {
    return this.apiCommunicationService.exec<void, PositionNetworkResponseDto>(
      new GetPositionByIdNetworkRequest(ctx, this.configService.positionServiceUrl, positionId),
    );
  }

  public async getPositionsByIds(
    ctx: InvocationContext,
    positionIds: string[],
  ): Promise<PaginationResponseDto<PositionNetworkResponseDto>> {
    return this.apiCommunicationService.exec<void, PaginationResponseDto<PositionNetworkResponseDto>>(
      new GetPositionsByIdsNetworkRequest(ctx, this.configService.positionServiceUrl, positionIds),
    );
  }
}
