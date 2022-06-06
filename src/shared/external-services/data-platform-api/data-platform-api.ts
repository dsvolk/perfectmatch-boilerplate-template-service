import { Inject, Injectable } from '@nestjs/common';
import {
  API_COMMUNICATION_SERVICE,
  ApiCommunicationInterface,
} from '../../api-communication-manager/interfaces/api-communication-manager.interface';
import { ConfigService } from '../../config/config.service';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { GenerateTalentIdNetworkRequest } from './network-requests/generate-talent-id.network-request';

@Injectable()
export class DataPlatformApi {
  private readonly logger = new AppLogger(DataPlatformApi.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(API_COMMUNICATION_SERVICE) private readonly apiCommunicationService: ApiCommunicationInterface,
  ) {
    this.logger.log('Init');
  }

  public async generateTalentId(ctx: InvocationContext, linkedinUrl: string): Promise<string> {
    return await this.apiCommunicationService.exec<void, string>(
      new GenerateTalentIdNetworkRequest(ctx, this.configService.dataPlatformApiUrl, linkedinUrl),
    );
  }
}
