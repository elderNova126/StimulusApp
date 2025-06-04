import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

export class StatusClassification {
  @IsString()
  companyId: string;

  @IsNumber()
  @IsOptional()
  NEW: number;

  @IsNumber()
  @IsOptional()
  OPEN: number;

  @IsNumber()
  @IsOptional()
  INREVIEW: number;

  @IsNumber()
  @IsOptional()
  INPROGRESS: number;

  @IsNumber()
  @IsOptional()
  COMPLETED: number;

  @IsNumber()
  @IsOptional()
  CANCELED: number;
}

export class ProjectStatusCountDTO {
  @IsObject()
  results: StatusClassification;

  @IsNumber()
  count: number;
}
export class CompanyTypeClassification {
  @IsString()
  companyId: string;

  @IsNumber()
  @IsOptional()
  CONSIDERED: number;

  @IsNumber()
  @IsOptional()
  QUALIFIED: number;

  @IsNumber()
  @IsOptional()
  SHORTLISTED: number;

  @IsNumber()
  @IsOptional()
  AWARDED: number;

  @IsNumber()
  @IsOptional()
  CLIENT: number;
}

export class ProjectCompanyCountDTO {
  @IsObject()
  results: CompanyTypeClassification;

  @IsNumber()
  count: number;
}
