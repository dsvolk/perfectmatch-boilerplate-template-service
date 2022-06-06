import { HttpRequestMethods } from '../../../api-communication-manager/enums/http-request-methods.enum';
import { NetworkRequest } from '../../../api-communication-manager/network-request/network-request';
import { InvocationContext } from '../../../interfaces/invocation-context.interface';
import { RequestMetadata } from '../../../api-communication-manager/interfaces/request-metadata';
import { TargetService } from '../../../api-communication-manager/enums/target-service.enum';

export class GetPositionByIdNetworkRequest extends NetworkRequest<any> {
  constructor(
    private readonly ctx: InvocationContext,
    private readonly baseUrl: string,
    private readonly positionId: string,
  ) {
    super(ctx);
  }

  getRequestMethod(): HttpRequestMethods {
    return HttpRequestMethods.Get;
  }

  getUrl(): string {
    return `${this.baseUrl}/v1/positions/${this.positionId}`;
  }

  public getBody(): any {
    return undefined;
  }

  public getQueryParams(): Map<string, any> | undefined {
    return undefined;
  }

  public getRequestMetadata(): RequestMetadata {
    return { targetService: TargetService.PositionService };
  }
}
