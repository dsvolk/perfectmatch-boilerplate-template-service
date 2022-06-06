import { AxiosError as AxiosException, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { ApiCommunicationInterface } from '../interfaces/api-communication-manager.interface';
import { NetworkRequest } from '../network-request/network-request';
import { RequestMetadata } from '../interfaces/request-metadata';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { AxiosError } from '../../exceptions/errors/axios.error';
import { paramMapToObject } from '../../utils/misc.utils';
import { HttpService } from '@nestjs/axios';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { InternalAppError } from '../../interfaces/internal-app-error.interface';
import { AppInternalErrorCode } from '../../exceptions/app-error-codes.enum';
import { AppError } from '../../exceptions/errors/app.error';

@Injectable()
export class AxiosApiCommunicationService implements ApiCommunicationInterface {
  protected headers: Map<string, string>;
  private readonly logger = new AppLogger(AxiosApiCommunicationService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log('Init');
  }

  public exec<T, K>(networkRequest: NetworkRequest<T>): Promise<K> {
    const requestName = networkRequest.constructor.name;
    const requestMetadata: RequestMetadata = networkRequest.getRequestMetadata();
    const method: any = networkRequest.getRequestMethod();
    const url: string = networkRequest.getUrl();
    const headers: any = paramMapToObject(networkRequest.getHeaders());
    const data: any = networkRequest.getBody();
    const params: object = paramMapToObject(networkRequest.getQueryParams());
    const iCtx: InvocationContext = networkRequest.getInvocationCtx();
    const requestConfig: AxiosRequestConfig = {
      url,
      headers,
      params,
      method,
      data,
    };
    this.logger.log(`Invoking ${requestName} to ${requestMetadata.targetService} - at ${url}`);
    return this.httpService
      .request(requestConfig)
      .pipe(
        tap(() => {
          this.logger.log(`Request to ${requestName} was successful`);
        }),
        map((response: AxiosResponse<K>) => response.data),
        catchError((error: AxiosException<InternalAppError, any>) => {
          const internalError: InternalAppError = error?.response?.data;
          if (internalError?.internalErrorCode && internalError.internalErrorCode !== AppInternalErrorCode.Unknown) {
            throw new AppError(
              internalError.internalErrorCode,
              internalError.message,
              internalError.statusCode,
              networkRequest.getInvocationCtx(),
              internalError.fieldsErrors,
            );
          }
          throw new AxiosError(url, method, headers, error, iCtx);
        }),
      )
      .toPromise();
  }
}
