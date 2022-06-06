export enum AccountStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Deactivated = 'DEACTIVATED',
}

export class AccountNetworkResponseDto {
  id: string;
  subDomainName: string;
  logo: string;
  displayName: string;
  accountStatus: AccountStatus;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
