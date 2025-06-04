import { ArgumentMetadata, Injectable, PipeTransform, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { GrpcFailedPreconditionException } from 'src/shared/utils-grpc/exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * Base type (e.g., `String`) of the data to be validated.
   */
  private readonly targetType?: Type<any> | undefined;
  private readonly targetDto?: Type<any> | undefined;

  constructor(targetType?: Type<any>, targetDto?: Type<any>) {
    this.targetType = targetType;
    this.targetDto = targetDto;
  }

  async transform(value: any, { data }: ArgumentMetadata) {
    const errors = await this.transformAndReturn(value, { data } as ArgumentMetadata);
    if (errors && errors.length > 0) {
      const fieldsWithFailedValidation = errors.map((i) => i.property);
      throw new GrpcFailedPreconditionException(
        `The following fields don't respect validation criteria: ${fieldsWithFailedValidation}`
      );
    }

    // Create a new object with the validated data accessible at the path specified in metadata
    if (data) {
      const result = {};
      const validatedValue = data ? await this.extractPayload(value, data) : value;
      const path = data.split('.');

      // Set up nested object structure based on the path
      let current = result;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = {};
        current = current[path[i]];
      }

      // Set the value at the final property
      current[path[path.length - 1]] = validatedValue;
      return result;
    }

    return value;
  }

  async transformAndReturn(value: any, { data }: ArgumentMetadata): Promise<ValidationError[]> {
    if (!this.targetType || !this.toValidate()) {
      return [];
    }

    const extractedValue = data ? await this.extractPayload(value, data) : value;
    if (extractedValue === undefined) {
      throw new GrpcFailedPreconditionException('The provided data for validation is undefined');
    }

    const object = plainToClass(this.targetType, extractedValue);
    return validate(object);
  }

  private toValidate(): boolean {
    const types: (new (...args: any[]) => any)[] = [String, Boolean, Number, Array, Object];
    return !types.includes(this.targetType);
  }

  private async extractPayload(value: any, data: string): Promise<any> {
    if (!value) return undefined;

    const propertyFields = data.split('.');
    let nestedValue = value;
    for (const property of propertyFields) {
      if (nestedValue && property in nestedValue) {
        nestedValue = nestedValue[property];
      } else {
        break;
      }
    }

    if (nestedValue === undefined) {
      nestedValue = value;
    }

    return this.validatePayload(nestedValue);
  }

  private async validatePayload(data: any) {
    if (!this.targetDto) return data;
    if (!data) return undefined;

    const object = plainToClass(this.targetDto, data);
    const errors = await validate(object);
    if (errors.length > 0) {
      const fieldsWithFailedValidation = errors.map((i) => i.property);
      throw new GrpcFailedPreconditionException(
        `The following fields don't respect validation criteria: ${fieldsWithFailedValidation}`
      );
    }
    return object;
  }
}
