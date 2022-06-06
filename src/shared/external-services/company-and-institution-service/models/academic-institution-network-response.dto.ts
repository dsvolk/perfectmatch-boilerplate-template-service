enum AcademicInstitutionType { // data pipeline values
  SecondarySchool = 'secondary school',
  PrimarySchool = 'primary school',
  PostSecondaryInstitution = 'post-secondary institution',
  Unknown = 'UNKNOWN',
}

class Location {
  city: string;
  state: string;
  country: string;
}

export class AcademicInstitutionNetworkResponseDto {
  id: string;
  name: string;
  logo: string;
  location: Location;
  linkedinUrl: string;
  isManual: boolean;
  type: AcademicInstitutionType;
  website: string;
  topUniversity: boolean;
}
