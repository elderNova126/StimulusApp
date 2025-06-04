import { string, object, array, number } from 'yup';
import { validateURL } from '../../utils/dataMapper';
import { isValid as validateCountry } from 'i18n-iso-countries';
// @ts-ignore
import { isValid } from 'ein-validator';

const reEmojis = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

export enum CompanyFormFields {
  INTERNAL_ID = 'Internal ID',
  INTERNAL_NAME = 'Internal Name',
  OWNERSHIP_DESCRIPTION = 'Ownership Description',
  WEBSITE = 'Website',
  LINKEDIN = 'Linkedin',
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  COMPANY_DESCRIPTION = 'Company Description',
  YEAR_FOUNDED = 'Year Founded',
  JURISDICTION_OF_INCORPORATION = 'Jurisdiction of Incorporation',
  JURISDICTION_OF_INCORPORATION_COUNTRY = 'Country',
  JURISDICTION_OF_INCORPORATION_COUNTRY_SUB_DIDBISION = 'Country Subdivision',
  PARENT_COMPANY_TAX_ID = 'Parent Company Tax ID',
  LEGAL_BUSINESS_NAME = 'Legal Name',
  DOING_BUSINESS_AS = 'Doing Business As',
  PREVIOUS_COMPANY_NAME = 'Previous',
  OTHER_COMPANY_NAME = 'Other',
  UPLOAD_PICTURE = 'Picture',
  COMPANY_TAX_ID = 'Company Tax Id',
}

export enum CreateSupplierFields {
  LEGAL_NAME = 'Legal Business Name',
  TAX_ID = 'Tax ID',
}

const ValidationCreateSupplierSchema = {
  [CreateSupplierFields.LEGAL_NAME]: string().max(250, 'Company Name can not exceed 250 characters').strict(),
  [CreateSupplierFields.TAX_ID]: string()
    .test(
      'is-iso',
      'Invalid Tax ID Format. Please use a valid 2-letter country code followed by a colon and the country tax identification in a standard format. For example, "US:12-3456789".',
      (taxIdNo) => {
        if (!taxIdNo) return true;
        let countryCode = taxIdNo.toUpperCase();
        countryCode = countryCode?.substring(0, 2);
        return validateCountry(countryCode);
      }
    )
    .test(
      'include-colon',
      'Invalid Tax ID Format. Please include a colon (:) after the 2-letter country code and before the country tax identification. For example, "US:12-3456789".',
      (taxIdNo) => {
        if (!taxIdNo) return true;
        return taxIdNo.includes(':');
      }
    )
    .test(
      'include-hyphen',
      `Invalid Tax ID Format. Please include a hyphen (-) after the country tax identification's first two digits. For example, "US:12-3456789".`,
      (taxIdNo) => {
        if (!taxIdNo) return true;
        return taxIdNo.includes('-');
      }
    )
    .test(
      'is-ein',
      'Invalid Tax ID Format. Please use a valid a valid EIN Code. For example, "US:12-3456789"',
      (taxIdNo) => {
        if (!taxIdNo) return true;
        const value: any = taxIdNo.split(':');
        return isValid(value[1]);
      }
    ),
};

const ValidationDiversityDescriptionSchema = {
  [CompanyFormFields.OWNERSHIP_DESCRIPTION]: string()
    .max(1500, 'Ownership Description can not exceed 1500 characters')
    .strict(),
};

const ValidationDescriptionSchema = {
  [CompanyFormFields.COMPANY_DESCRIPTION]: string()
    .max(5000, 'Company Description can not exceed 5000 characters')
    .strict(),
};

const ValidationRelationShipSchema = {
  [CompanyFormFields.INTERNAL_ID]: string().max(250, 'Internal ID can not exceed 250 characters').strict(),
  [CompanyFormFields.INTERNAL_NAME]: string().max(250, 'Internal Name can not exceed 250 characters').strict(),
};

const ValidationOverViewSchema = {
  [CompanyFormFields.DOING_BUSINESS_AS]: string()
    .test('no-emoji', 'Emojis are not allowed', (value) => {
      if (!value) return true;
      return !reEmojis.test(value);
    })
    .test('one-at-least', 'Legal Business Name or Doing Business As is required', (value, context) => {
      const legalBusinessName = context.parent[CompanyFormFields.LEGAL_BUSINESS_NAME];
      if (!value && !legalBusinessName) return false;
      return true;
    })
    .max(250, 'The text should not exceed 250 characters.')
    .strict(),
  [CompanyFormFields.LEGAL_BUSINESS_NAME]: string()
    .test('no-emoji', 'Emojis are not allowed', (value) => {
      if (!value) return true;
      return !reEmojis.test(value);
    })
    .test('one-at-least', 'Legal Business Name or Doing Business As is required', (value, context) => {
      const doingBusinessAs = context.parent[CompanyFormFields.DOING_BUSINESS_AS];
      if (!value && !doingBusinessAs) return false;
      return true;
    })
    .max(250, 'The text should not exceed 250 characters.')
    .strict(),
  [CompanyFormFields.PREVIOUS_COMPANY_NAME]: array().of(
    string()
      .test('no-emoji', 'Emojis are not allowed', (value) => {
        if (!value) return true;
        return !reEmojis.test(value);
      })
      .test('no-repeated', 'The value cannot be repeated', (value, context) => {
        if (!value) return true;
        const previousNames = context.parent;
        if (!previousNames) return true;
        const hasRepeated = previousNames.filter((name: string) => name === value).length > 1;
        return !hasRepeated;
      })
      .max(250, 'Previous Company Name can not exceed 250 characters')
      .strict()
  ),
  [CompanyFormFields.OTHER_COMPANY_NAME]: array().of(
    string()
      .test('no-emoji', 'Emojis are not allowed', (value) => {
        if (!value) return true;
        return !reEmojis.test(value);
      })
      .test('no-repeated', 'The value cannot be repeated', (value, context) => {
        if (!value) return true;
        const otherNames = context.parent;
        if (!otherNames) return true;
        const hasRepeated = otherNames.filter((name: string) => name === value).length > 1;
        return !hasRepeated;
      })
      .max(250, 'Other Company Name can not exceed 250 characters')
      .strict()
  ),
  [CompanyFormFields.YEAR_FOUNDED]: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .typeError('Year Founded must be a number')
    .nullable()
    .notRequired()
    .min(1800, 'The year should be between 1800 to the current year.')
    .max(new Date().getFullYear(), 'The year should not be greater than the current year.'),
  [CompanyFormFields.PARENT_COMPANY_TAX_ID]: string()
    .max(55, 'Parent Company Tax ID can not exceed 55 characters')
    .notRequired()
    .test(
      'is-ein',
      'Invalid Parent Company Tax ID. Please provide a valid Parent Company Tax ID, such as ‘US:12-3456789’',
      (taxIdNo) => {
        if (!taxIdNo) return true;
        const [firstPart, secondPart] = taxIdNo.split(':');
        const countryCode = firstPart.toUpperCase();
        return isValid(secondPart) && validateCountry(countryCode) && taxIdNo.includes('-', 5);
      }
    )
    .test(
      'is-same-as-parent',
      'Invalid Parent Company Tax ID. Please provide a Tax ID different than your company Tax ID',
      (taxIdNo, context: any) => {
        const parentTaxId = context?.parent?.['Company Tax Id'];

        const isSameAsParent = taxIdNo !== parentTaxId ? true : false;

        return isSameAsParent;
      }
    ),
  [CompanyFormFields.COMPANY_TAX_ID]: string().notRequired(),
  [CompanyFormFields.WEBSITE]: string()
    .notRequired()
    .max(250, 'Website can not exceed 250 characters')
    .test(
      'is-url',
      'Invalid website URL. Please provide a valid URL for the company’s website, such as ‘https://www.company_name.com’.',
      (value) => {
        const valid = validateURL(value ?? '');
        return valid;
      }
    ),
  [CompanyFormFields.LINKEDIN]: string()
    .notRequired()
    .max(250, 'LinkedIn can not exceed 250 characters')
    .matches(
      /^(?:|(https?:\/\/(.+?\.)?linkedin\.com\/company(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/,
      'Invalid LinkedIn company profile URL. Please provide a valid LinkedIn company page URL, such as ’https://www.linkedin.com/company/company_name’.'
    ),
  [CompanyFormFields.FACEBOOK]: string()
    .notRequired()
    .max(250, 'Facebook can not exceed 250 characters')
    .matches(
      /^(?:|(https?:\/\/(.+?\.)?facebook\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/,
      "Invalid Facebook company profile URL. Please provide a valid Facebook URL for the company’s profile, such as ‘https://www.facebook.com/company_name’'."
    ),
  [CompanyFormFields.TWITTER]: string()
    .notRequired()
    .max(250, 'Twitter can not exceed 250 characters')
    .matches(
      /^(?:|(https?:\/\/(.+?\.)?twitter\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?))$/,
      'Invalid Twitter company profile URL. Please provide a valid Twitter URL for the company’s profile, such as ’https://www.twitter.com/company_user_name’.'
    ),
};

const ValidationUploadPictureSchema = {
  [CompanyFormFields.UPLOAD_PICTURE]: string()
    .notRequired()
    .test(
      'fileFormat',
      'Upload Failed: There was an issue processing your image. Please ensure the file format is supported (e.g., SVG, JPEG, PNG) and try again.',
      (value: any) => {
        if (!value) return true;
        const supportedFormats = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
        return supportedFormats.includes(value);
      }
    ),
};

export default object().shape({
  ...ValidationOverViewSchema,
  ...ValidationDiversityDescriptionSchema,
  ...ValidationRelationShipSchema,
  ...ValidationDescriptionSchema,
  ...ValidationCreateSupplierSchema,
  ...ValidationUploadPictureSchema,
});
