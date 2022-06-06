export enum PositionStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deleted = 'DELETED',
}

export class PositionNetworkResponseDto {
  id: string;
  accountId: string;
  jobTitle: string;
  status: PositionStatus;
  remotePosition: boolean;
  jobDescriptionUrl: string;
  idealCandidates: string[];
  hiringManagers: string[];
  createdAt: Date;
  updatedAt: Date;
}
