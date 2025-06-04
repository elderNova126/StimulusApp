import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { isValid as validateCountry } from 'i18n-iso-countries';
import { isValid } from 'ein-validator';

@ValidatorConstraint({ name: 'isValidEIN', async: false })
class IsValidEINConstraint implements ValidatorConstraintInterface {
  validate(taxIdNo: string) {
    const [firstPart, secondPart] = taxIdNo.split(':');
    const countryCode = firstPart.toUpperCase();
    return (isValid(secondPart) && validateCountry(countryCode) && taxIdNo.includes('-', 5)) || taxIdNo === '';
  }
  defaultMessage() {
    return `Invalid parentCompanyTaxId. Please provide a valid Parent Company Tax ID, such as ‘US:12-3456789’`;
  }
}

export const IsValidEIN = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidEIN',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidEINConstraint,
    });
  };
};
