import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'IsWebsiteValid', async: false })
class IsWebsiteValid implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === '') return true;
    return value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/) !== null;
  }
}

export const WebsiteValid = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsWebsiteValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsWebsiteValid,
    });
  };
};
