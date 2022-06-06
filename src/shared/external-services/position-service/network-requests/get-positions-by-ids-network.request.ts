import { NetworkRequest } from '../../../api-communication-manager/network-request/network-request';
import { InvocationContext } from '../../../interfaces/invocation-context.interface';
import { HttpRequestMethods } from '../../../api-communication-manager/enums/http-request-methods.enum';
import { RequestMetadata } from '../../../api-communication-manager/interfaces/request-metadata';
import { TargetService } from '../../../api-communication-manager/enums/target-service.enum';
import { AndLookupFilter, FieldType, UrlQueryParamBuilder } from '@talent-fabric/url-query-builder';

export class GetPositionsByIdsNetworkRequest extends NetworkRequest<any> {
  constructor(
    private readonly ctx: InvocationContext,
    private readonly baseUrl: string,
    private readonly positionIds: string[],
  ) {
    super(ctx);
  }

  getQueryParams(): Map<string, any> {
    return new UrlQueryParamBuilder()
      .andWhere('id', AndLookupFilter.IN, this.positionIds.join(','), FieldType.ObjectId)
      .getQueryMap();
  }

  getRequestMethod(): HttpRequestMethods {
    return HttpRequestMethods.Get;
  }

  getUrl(): string {
    return `${this.baseUrl}/v1/positions`;
  }

  public getBody(): any {
    return undefined;
  }

  public getRequestMetadata(): RequestMetadata {
    return { targetService: TargetService.PositionService };
  }
}
