import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'IsYearFoundedValid', async: false })
class IsYearFoundedValid implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === 0) return true;
    return value > 1800 && value <= new Date().getFullYear();
  }
  defaultMessage(): string {
    return 'The year founded must be greater than 1800 and less than or equal to the current year.';
  }
}

export const YearFoundedValid = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsYearFoundedValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsYearFoundedValid,
    });
  };
};
