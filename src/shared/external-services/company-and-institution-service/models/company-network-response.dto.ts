class Location {
  city: string;
  state: string;
  country: string;
}

class Industry {
  id: string;
  value: string;
}

export class CompanyNetworkResponseDto {
  id: string;
  internalId: string;
  primaryId: string;
  linkedinUrl: string;
  name: string;
  logo: string;
  description: string;
  fullDescription: string;
  location: Location;
  size: string;
  isEnriched: boolean;
  isManual: boolean;
  isPublic: boolean;
  stockSymbol: string;
  industries: Industry[];
  foundedAt: Date;
  website: string;
  totalFundingsUsd: number;
  ipoStatus: string;
  lastFundingType: string;
}
