import { Inject, Injectable } from '@nestjs/common';
import {
  API_COMMUNICATION_SERVICE,
  ApiCommunicationInterface,
} from '../../api-communication-manager/interfaces/api-communication-manager.interface';
import { ConfigService } from '../../config/config.service';
import { InvocationContext } from '../../interfaces/invocation-context.interface';
import { GetOrCreateCompanyFromLinkedinUrlNetworkRequest } from './network-requests/get-or-create-company-from-linkedin-url.network-request';
import { CompanyNetworkResponseDto } from './models/company-network-response.dto';
import { AcademicInstitutionNetworkResponseDto } from './models/academic-institution-network-response.dto';
import { GetOrCreateAcademicInstitutionFromLinkedinUrlNetworkRequest } from './network-requests/get-or-create-academic-institution-from-linkedin-url.network-request';
import { GetCompaniesIncludingManualNetworkRequest } from './network-requests/get-companies-including-manual.network-request';
import { GetAcademicInstitutionsIncludingManualNetworkRequest } from './network-requests/get-academic-institutions-including-manual.network-request';
import { AppLogger } from '@talent-fabric/nestjs-logger';

@Injectable()
export class CompanyAndInstitutionService {
  private readonly logger = new AppLogger(CompanyAndInstitutionService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(API_COMMUNICATION_SERVICE) private readonly apiCommunicationService: ApiCommunicationInterface,
  ) {
    this.logger.log('Init');
  }

  public async getOrCreateCompanyFromLinkedinUrl(
    ctx: InvocationContext,
    linkedinUrl: string,
  ): Promise<CompanyNetworkResponseDto> {
    return await this.apiCommunicationService.exec<void, CompanyNetworkResponseDto>(
      new GetOrCreateCompanyFromLinkedinUrlNetworkRequest(ctx, this.configService.companyServiceUrl, linkedinUrl),
    );
  }

  public async getOrCreateAcademicInstitutionFromLinkedinUrl(
    ctx: InvocationContext,
    linkedinUrl: string,
  ): Promise<AcademicInstitutionNetworkResponseDto> {
    return await this.apiCommunicationService.exec<void, AcademicInstitutionNetworkResponseDto>(
      new GetOrCreateAcademicInstitutionFromLinkedinUrlNetworkRequest(
        ctx,
        this.configService.companyServiceUrl,
        linkedinUrl,
      ),
    );
  }

  public async getCompaniesIncludingManual(
    ctx: InvocationContext,
    ids: string[],
  ): Promise<CompanyNetworkResponseDto[]> {
    return await this.apiCommunicationService.exec<void, CompanyNetworkResponseDto[]>(
      new GetCompaniesIncludingManualNetworkRequest(ctx, this.configService.companyServiceUrl, ids),
    );
  }

  public async getAcademicInstitutionsIncludingManual(
    ctx: InvocationContext,
    ids: string[],
  ): Promise<AcademicInstitutionNetworkResponseDto[]> {
    return await this.apiCommunicationService.exec<void, AcademicInstitutionNetworkResponseDto[]>(
      new GetAcademicInstitutionsIncludingManualNetworkRequest(ctx, this.configService.companyServiceUrl, ids),
    );
  }
}
