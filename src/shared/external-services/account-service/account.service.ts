import { Inject, Injectable } from '@nestjs/common';
import {
  API_COMMUNICATION_SERVICE,
  ApiCommunicationInterface,
} from '../../api-communication-manager/interfaces/api-communication-manager.interface';
import { ConfigService } from '../../config/config.service';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { AccountNetworkResponseDto } from './models/account-network-response.dto';
import { GetAccountByIdNetworkRequest } from './network-requests/get-account-by-id.network-request';

@Injectable()
export class AccountService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(API_COMMUNICATION_SERVICE) private readonly apiCommunicationService: ApiCommunicationInterface,
  ) {}

  public async getAccountById(ctx: InvocationContext, accountId: string): Promise<AccountNetworkResponseDto> {
    return this.apiCommunicationService.exec<void, AccountNetworkResponseDto>(
      new GetAccountByIdNetworkRequest(ctx, this.configService.accountServiceUrl, accountId),
    );
  }
}
