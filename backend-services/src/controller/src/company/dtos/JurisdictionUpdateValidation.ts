import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import iso3166 from 'iso-3166-2';
import iso3311a2 from 'iso-3166-1-alpha-2';

@ValidatorConstraint({ name: 'isValidJurisdiction', async: false })
class IsValidJurisdictionConstraint implements ValidatorConstraintInterface {
  validate(jurisdictionOfIncorporation: string) {
    const [country, countrySub] = jurisdictionOfIncorporation.split('-');
    const ListOfCountries = iso3311a2.getCodes();
    const infoCountry = iso3166.country(country);
    const sub = infoCountry?.sub ?? {};
    const keys = Object.keys(sub);
    const KeysWithOutContry = keys.map((key) => key.replace(`${country.toUpperCase()}-`, ''));

    return (
      ListOfCountries.includes(country) ||
      (jurisdictionOfIncorporation === '' && (KeysWithOutContry.includes(countrySub) || !countrySub))
    );
  }
  defaultMessage() {
    return `Invalid jurisdictionOfIncorporation. Please provide a valid ISO 3166 Country Code, such as ‘US’ or ‘US-CA’.`;
  }
}

export const IsValidJurisdiction = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidJurisdiction',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidJurisdictionConstraint,
    });
  };
};
