import { IsNumber, Matches, IsString, MaxLength, IsOptional } from 'class-validator';
import { IsValidJurisdiction } from './JurisdictionUpdateValidation';
import { IsValidEIN } from './EINvalidation';
import { YearFoundedValid } from './YearFoundUpdateValidate';
import { WebsiteValid } from './WebsiteUpdatedValidate';
import { HavaAEmoji, CheckTypeNamesValidation } from './HaveAEmojiValidation';

export class UpdateCompanyDto {
  @IsOptional()
  @CheckTypeNamesValidation()
  @HavaAEmoji()
  otherBusinessNames?: string[] | string;

  @IsOptional()
  @CheckTypeNamesValidation()
  @HavaAEmoji()
  previousBusinessNames?: string[] | string;

  @IsString()
  @IsOptional()
  @IsValidJurisdiction({ message: 'Invalid jurisdictionOfIncorporation' })
  @MaxLength(6, { message: 'ISO 3166 Country Code can not exceed 6 characters' })
  jurisdictionOfIncorporation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(55, { message: 'Parent Company Tax ID can not exceed 55 characters' })
  @IsValidEIN({ message: 'Invalid parentCompanyTaxId' })
  parentCompany?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500, { message: 'Ownership Description can not exceed 1500 characters' })
  ownershipDescription: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Company Description can not exceed 5000 characters' })
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(350, { message: 'Company Description can not exceed 350 characters' })
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(250, { message: 'Internal ID can not exceed 250 characters' })
  internalId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(250, { message: 'Internal Name can not exceed 250 characters' })
  internalName?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Year Founded must be a number' })
  @YearFoundedValid({ message: 'Invalid yearFounded' })
  yearFounded?: number;

  @IsOptional()
  @WebsiteValid({ message: 'Invalid website' })
  @MaxLength(250, { message: 'Website can not exceed 250 characters' })
  website?: string;

  @IsOptional()
  @MaxLength(250, { message: 'LinkedIn can not exceed 250 characters' })
  @Matches(/^(?:|(https?:\/\/(.+?\.)?linkedin\.com\/company(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/, {
    message:
      'Invalid LinkedIn company profile URL. Please provide a valid LinkedIn company page URL, such as ’https://www.linkedin.com/company/company_name’.',
  })
  linkedin?: string;

  @IsOptional()
  @MaxLength(250, { message: 'Facebook can not exceed 250 characters' })
  @Matches(/^(?:|(https?:\/\/(.+?\.)?facebook\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/, {
    message:
      "Invalid Facebook company profile URL. Please provide a valid Facebook URL for the company’s profile, such as ‘https://www.facebook.com/company_name’'.",
  })
  facebook?: string;

  @IsOptional()
  @MaxLength(250, { message: 'Twitter can not exceed 250 characters' })
  @Matches(/^(?:|(https?:\/\/(.+?\.)?twitter\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/, {
    message:
      'Invalid Twitter company profile URL. Please provide a valid Twitter URL for the company’s profile, such as ’https://www.twitter.com/company_user_name’.',
  })
  twitter?: string;

  @IsString()
  @IsOptional()
  @MaxLength(55, { message: 'Parent Company Tax ID can not exceed 55 characters' })
  @IsValidEIN({ message: 'Invalid parentCompanyTaxId' })
  parentCompanyTaxId?: string;
}
