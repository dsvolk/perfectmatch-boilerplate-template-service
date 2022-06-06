import { Consts } from '../../config/consts';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { HttpRequestMethods } from '../enums/http-request-methods.enum';
import { RequestMetadata } from '../interfaces/request-metadata';

export abstract class NetworkRequest<T> {
  protected invocationContext: InvocationContext;

  protected constructor(invocationContext: InvocationContext) {
    this.invocationContext = invocationContext;
  }

  public abstract getRequestMetadata(): RequestMetadata;

  public abstract getRequestMethod(): HttpRequestMethods;

  public abstract getUrl(): string;

  public abstract getQueryParams(): Map<string, any> | undefined;

  public abstract getBody(): any;

  public getHeaders(): Map<string, any> {
    return new Map<string, any>([[`${Consts.correlationIdHeaderName}`, this.invocationContext?.correlationId]]);
  }

  public getInvocationCtx(): InvocationContext {
    return this.invocationContext;
  }
}
