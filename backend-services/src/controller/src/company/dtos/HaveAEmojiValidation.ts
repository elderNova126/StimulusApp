import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'HaveAEmoji', async: false })
class HaveAEmojiValidation implements ValidatorConstraintInterface {
  validate(Value: string | string[]) {
    const reEmojis =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    if (typeof Value === 'string') {
      const castToArray = Value.split('| ');
      return castToArray.every((v) => !reEmojis.test(v));
    }
    if (Array.isArray(Value)) {
      return Value.every((v) => !reEmojis.test(v));
    }
    return false;
  }
  defaultMessage() {
    return 'Invalid Emoji';
  }
}

export const HavaAEmoji = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'HaveAEmojiValidation',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: HaveAEmojiValidation,
    });
  };
};

class CheckType implements ValidatorConstraintInterface {
  validate(Value: string | string[]) {
    if (typeof Value === 'string') {
      return true;
    }
    if (Array.isArray(Value)) {
      return true;
    }
    return false;
  }
  defaultMessage() {
    return 'Invalid Type';
  }
}

export const CheckTypeNamesValidation = (validationOptions?: any) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'CheckTypeValidation',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CheckType,
    });
  };
};
