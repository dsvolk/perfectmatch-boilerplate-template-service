import { RequestMetadata } from '../../../api-communication-manager/interfaces/request-metadata';
import { TargetService } from '../../../api-communication-manager/enums/target-service.enum';
import { InvocationContext } from '../../../interfaces/invocation-context.interface';
import { NetworkRequest } from '../../../api-communication-manager/network-request/network-request';
import { HttpRequestMethods } from '../../../api-communication-manager/enums/http-request-methods.enum';

export class GetAcademicInstitutionsIncludingManualNetworkRequest extends NetworkRequest<any> {
  private readonly targetService: TargetService = TargetService.CompanyAndInstitutionService;

  constructor(
    private readonly ctx: InvocationContext,
    private readonly baseUrl: string,
    private readonly ids: string[],
  ) {
    super(ctx);
  }

  getBody(): any {
    return undefined;
  }

  getQueryParams(): Map<string, any> {
    return new Map<string, string>([['ids', this.ids.join()]]);
  }

  getRequestMetadata(): RequestMetadata {
    return { targetService: this.targetService };
  }

  getRequestMethod(): HttpRequestMethods {
    return HttpRequestMethods.Get;
  }

  getUrl(): string {
    return `${this.baseUrl}/v1/academic-institutions/including-manual`;
  }
}
